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
    // Regex "Padrão Ouro": exige pelo menos 2 letras após o último ponto
    // Isso evita que 'gmail.co' passe se o usuário esqueceu o 'm'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      setError("Informe seu email");
      return;
    } 
    
    if (!emailRegex.test(email)) {
      setError("Informe um e-mail válido (ex: usuario@email.com)");
      return;
    }

    setError("");
    setLoading(true);

    // Simulação de envio de link de recuperação
    setTimeout(() => {
      setLoading(false);
      alert("Link de recuperação enviado para seu e-mail!");
    }, 2000);
  };

  return (
    <SafeAreaView
      // O flatten resolve o erro de 'CSSStyleDeclaration' no navegador
      style={StyleSheet.flatten([styles.container, { backgroundColor: COLORS.primary || "#3B6EDC" }])}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Espaçamento para o topo azul */}
        <View style={styles.topSpace} />

        <View style={styles.card}>
          {/* Logo Centralizada no Card */}
          <View style={styles.logoWrapper}>
            <Image
              source={require("../assets/images/logoImg.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Recuperar senha</Text>
          <Text style={styles.subtitle}>
            Informe seu e-mail cadastrado para receber as instruções de recuperação.
          </Text>

          <View style={styles.form}>
            <Input
              label="E-mail"
              iconName="email"
              placeholder="seuemail@email.com"
              value={email}
              onChangeText={setEmail}
              error={error}
              // Melhora a experiência no mobile
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Button
            title="Enviar link"
            onPress={handleRecover}
            isLoading={loading}
          />

          {/* Rodapé para voltar ao login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Lembrou sua senha? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={StyleSheet.flatten([styles.linkText, { color: COLORS.primary }])}>
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
    paddingBottom: 40,
  },
  topSpace: {
    height: 60,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 32, // Padronizado com Login/Register
    padding: 28,
    // Sombras para Mobile
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Ajustes de equilíbrio para Telas Grandes (Web/Tablet)
    maxWidth: 500,
    alignSelf: 'center',
    width: '90%', // Garante margem em telas pequenas
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 28,
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
    fontSize: 15,
  },
  linkText: {
    fontWeight: "bold",
    fontSize: 15,
  },
});