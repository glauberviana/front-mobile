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
import { validateRegisterForm } from "../src/utils/validators";

export default function Register() {
  //ESTADOS (States)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    contato: "",
    senha: "",
    confirmar: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  //FUNÇÃO DE CADASTRO
  const handleRegister = async () => {
    // Validação usando seu arquivo validators.ts
    const validationErrors = validateRegisterForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulação de chamada de API
    setTimeout(() => {
      setLoading(false);
      alert("Conta criada com sucesso!");
    }, 2000);
  };

  //RENDERIZAÇÃO
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Image
              source={require("../assets/images/logoImg.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Comece a organizar suas tarefas agora
          </Text>

          <View style={styles.form}>
            <Input
              label="Nome"
              iconName="person"
              placeholder="Seu nome completo"
              value={formData.nome}
              onChangeText={(text) => setFormData({ ...formData, nome: text })}
              error={errors.nome}
            />

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
              label="Contato"
              iconName="phone"
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
              value={formData.contato}
              onChangeText={(text) =>
                setFormData({ ...formData, contato: text })
              }
              error={errors.contato}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Input
                  label="Senha"
                  placeholder="••••••"
                  secureTextEntry
                  iconName="lock"
                  value={formData.senha}
                  onChangeText={(text) =>
                    setFormData({ ...formData, senha: text })
                  }
                  error={errors.senha}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Confirmar"
                  placeholder="••••••"
                  secureTextEntry
                  iconName="lock-outline"
                  value={formData.confirmar}
                  onChangeText={(text) =>
                    setFormData({ ...formData, confirmar: text })
                  }
                  error={errors.confirmar}
                />
              </View>
            </View>
          </View>

          <Button
            title="Cadastrar"
            onPress={handleRegister}
            isLoading={loading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: COLORS.primary }]}>
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

//ESTILOS
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
  form: {
    gap: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    width: "100%",
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
