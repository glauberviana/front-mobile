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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRecover = async () => {
    if (!email) {
      setError("Informe seu email");
      return;
    }

    setError("");
    setLoading(true);

    // Simulação (igual seus colegas fizeram)
    setTimeout(() => {
      setLoading(false);
      alert("Link de recuperação enviado para seu email!");
    }, 2000);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.primary }]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSpace} />

        <View style={styles.card}>
          {/* Logo */}
          <View style={styles.logoWrapper}>
            <Image
              source={require("../assets/images/logoImg.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Título */}
          <Text style={styles.title}>Recuperar senha</Text>
          <Text style={styles.subtitle}>
            Informe seu email para receber o link de recuperação
          </Text>

          {/* Input */}
          <View style={styles.form}>
            <Input
              label="Email"
              iconName="email"
              placeholder="seuemail@email.com"
              value={email}
              onChangeText={setEmail}
              error={error}
            />
          </View>

          {/* Botão */}
          <Button
            title="Enviar link"
            onPress={handleRecover}
            isLoading={loading}
          />

          {/* Voltar pro login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Lembrou sua senha? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text
                  style={[
                    styles.linkText,
                    { color: COLORS.primary },
                  ]}
                >
                  Fazer login
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
  logo: {
    width: 200,
    height: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    marginTop: 6,
  },
  form: {
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#6b7280",
  },
  linkText: {
    fontWeight: "bold",
  },
});