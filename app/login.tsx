import { Link, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
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

  const handleLogin = async () => {
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <SafeAreaView 
      style={StyleSheet.flatten([styles.container, { backgroundColor: COLORS.primary || "#3B6EDC" }])}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        bounces={false}
      >
        {/* Espaçamento superior para a logo respirar */}
        <View style={styles.topSpace} />

        <View style={styles.card}>
          {/* Logo Centralizada no topo do card esticado */}
          <View style={styles.logoWrapper}>
            <Image 
              source={require("../assets/images/logoImg.png")} 
              style={styles.logoCard}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Entre com suas credenciais para acessar o sistema</Text>

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

            <Link href="/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotPass}>
                <Text style={StyleSheet.flatten([styles.linkText, { color: COLORS.primary, textAlign: 'right' }])}>
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>
            </Link>
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
                <Text style={StyleSheet.flatten([styles.linkText, { color: COLORS.primary }])}>
                  Criar conta
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
    flex: 1 
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingBottom: 40,
  },
  topSpace: {
    height: 60, // Espaço entre o topo da tela e o card
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
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCard: {
    width: 200, 
    height: 60,
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#111827" 
  },
  subtitle: { 
    fontSize: 15, 
    color: "#6b7280", 
    marginBottom: 32, 
    marginTop: 6 
  },
  form: { 
    gap: 12, 
    marginBottom: 24 
  },
  forgotPass: { 
    alignSelf: 'flex-end', 
    paddingVertical: 8 
  },
  linkText: { 
    fontWeight: "bold", 
    fontSize: 15 
  },
  dividerContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 25 
  },
  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#e5e7eb' 
  },
  dividerText: { 
    marginHorizontal: 12, 
    color: '#9ca3af', 
    fontSize: 14 
  },
  footer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginTop: 10 
  },
  footerText: { 
    color: "#6b7280", 
    fontSize: 16 
  },
});