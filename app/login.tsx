import { MaterialIcons } from "@expo/vector-icons";
import { Link, Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/services/api";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Button from "../src/components/Button";
import Input from "../src/components/Input";
import { COLORS } from "../src/utils/theme";
import { validateLoginForm } from "../src/utils/validators";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Estado para controlar o "Lembrar de mim"
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (loading) return;

    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.senha,
      });

      const { access_token } = response.data.data;
      if (access_token) {
        await AsyncStorage.setItem("@TaskCycle:token", access_token);
        setLoading(false);
        router.replace("/home"); // AQUI acontece o redirecionamento
      }
    } catch (error: any) {
      setLoading(false);
      const apiError = error.response?.data?.message || "Erro de conexão ou credenciais inválidas.";
      setErrors({ email: apiError });
    }
  };
  return (
    <SafeAreaView
      style={StyleSheet.flatten([
        styles.container,
        { backgroundColor: COLORS.primary || "#3B6EDC" },
      ])}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.topSpace} />

        <View style={styles.card}>
          {/* Logo Centralizada no topo do card */}
          <View style={styles.logoWrapper}>
            <Image
              source={require("../assets/images/logoImg.png")}
              style={styles.logoCard}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>
            Entre com suas credenciais para acessar o sistema
          </Text>

          <View style={styles.form}>
            <Input
              label="Email"
              iconName="email"
              placeholder="seuemail@email.com"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              error={errors.email}
            />

            <Input
              label="Senha"
              placeholder="••••••"
              iconName="vpn-key"
              secureTextEntry={true}
              value={formData.senha}
              onChangeText={(text) => setFormData({ ...formData, senha: text })}
              error={errors.senha}
            />

            {/* Linha de Ações: Checkbox e Esqueci Senha */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={rememberMe ? "check-box" : "check-box-outline-blank"}
                  size={22}
                  color={rememberMe ? COLORS.primary : "#9ca3af"}
                />
                <Text style={styles.rememberMeText}>Lembrar de mim</Text>
              </TouchableOpacity>

              <Link href="/forgot-password" asChild>
                <TouchableOpacity style={styles.forgotPass}>
                  <Text
                    style={StyleSheet.flatten([
                      styles.linkText,
                      { color: COLORS.primary, textAlign: "right" },
                    ])}
                  >
                    Esqueci minha senha
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <Button title="Entrar" onPress={handleLogin} isLoading={loading} />

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem conta? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text
                  style={StyleSheet.flatten([
                    styles.linkText,
                    { color: COLORS.primary },
                  ])}
                >
                  Crie uma!
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingBottom: 40,
  },
  topSpace: {
    height: 60,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoCard: {
    width: 200,
    height: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 24,
    marginTop: 6,
  },
  form: {
    gap: 10,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rememberMeText: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "500",
  },
  forgotPass: {
    paddingVertical: 8,
  },
  linkText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#9ca3af",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  footerText: {
    color: "#6b7280"
  },
});
