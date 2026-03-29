import { Link, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Dimensions,
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

const { width } = Dimensions.get("window");

export default function Login() {
  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validação de campos obrigatórios [cite: 41, 87]
    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulação de autenticação (Integrar com API futuramente) [cite: 33, 40]
    setTimeout(() => {
      setLoading(false);
      console.log("Tentativa de login:", formData.email);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Seção de Identidade Visual (Azul) */}
        <View style={[styles.brandSection, { backgroundColor: COLORS.primary || "#3b6bc4" }]}>
          <Text style={styles.logoText}>TaskCycle</Text>
          <Text style={styles.brandDescription}>
            Gestão inteligente de demandas entre setores da sua instituição. Organize, acompanhe e resolva com eficiência.
          </Text>
        </View>

        {/* Formulário de Login (Card Branco) */}
        <View style={styles.card}>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Entre com suas credenciais para acessar o sistema</Text>

          <View style={styles.form}>
            <Input
              label="Email"
              iconName="email"
              placeholder="seuemail@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              error={errors.email}
            />

            <Input
              label="Senha"
              placeholder="********"
              iconName="vpn-key"
              value={formData.senha}
              onChangeText={(text) => setFormData({ ...formData, senha: text })}
              error={errors.senha}
              secureTextEntry={true} // Ativa a lógica do olhinho no componente Input
            />

            <View style={styles.optionsRow}>
              <Link href="/forgot-password" asChild>
                <TouchableOpacity>
                  <Text style={[styles.linkText, { color: COLORS.primary }]}>Esqueci minha senha</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <Button title="Entrar" onPress={handleLogin} isLoading={loading} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem conta? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: COLORS.primary }]}>Cadastre-se</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Text style={styles.copyright}>TaskFlow Acadêmico © 2026 — Todos os direitos reservados</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1 },
  brandSection: { padding: 30, paddingTop: 60, paddingBottom: 50 },
  logoText: { fontSize: 48, fontWeight: "bold", color: "#fff" },
  brandDescription: { fontSize: 15, color: "#fff", marginTop: 10, maxWidth: width * 0.85 },
  card: { flex: 1, backgroundColor: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -30, padding: 24, elevation: 5 },
  title: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 28 },
  form: { gap: 12, marginBottom: 20 },
  optionsRow: { alignItems: "flex-end" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 25 },
  footerText: { color: "#6b7280" },
  linkText: { fontWeight: "bold" },
  copyright: { textAlign: "center", color: "#9ca3af", fontSize: 11, marginTop: "auto", paddingTop: 30 },
});