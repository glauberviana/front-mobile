import { MaterialIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const COLORS = {
  accent: "#5EA5E8",
  white: "#FFFFFF",
  background: "#F3F4F6",
  bottomBar: "#F8F8F8",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
};

export default function EditScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("Nayelly Roberta");
  const [email, setEmail] = useState("nayelly@email.com");
  const [phone, setPhone] = useState("(87) 99999-9999");

  const bottomBarHeight = 60 + insets.bottom;

  function handleSave() {
    Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={22}
              color={COLORS.text}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Editar Perfil
          </Text>

          <View style={{ width: 32 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <MaterialIcons
                name="person"
                size={54}
                color={COLORS.white}
              />
            </View>

            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.changePhotoText}>
                Alterar foto
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Nome</Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Digite seu nome"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email</Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Telefone</Text>

              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Digite seu telefone"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.85}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>
                Salvar alterações
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.bottomBar,
            {
              paddingBottom: insets.bottom,
              minHeight: bottomBarHeight,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.bottomItem}
            activeOpacity={0.8}
          >
            {pathname === "/create" ? (
              <View style={styles.activeCircle}>
                <MaterialIcons name="add" size={24} color="#fff" />
              </View>
            ) : (
              <MaterialIcons name="add" size={24} color="#5EA5E8" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            activeOpacity={0.8}
            onPress={() => router.push("/home")}
          >
            {pathname === "/home" ? (
              <View style={styles.activeCircle}>
                <MaterialIcons name="list" size={22} color="#fff" />
              </View>
            ) : (
              <MaterialIcons name="list" size={22} color="#5EA5E8" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            activeOpacity={0.8}
            onPress={() => router.push("/calendar")}
          >
            {pathname === "/calendar" ? (
              <View style={styles.activeCircle}>
                <MaterialIcons
                  name="calendar-today"
                  size={22}
                  color="#fff"
                />
              </View>
            ) : (
              <MaterialIcons
                name="calendar-today"
                size={22}
                color="#5EA5E8"
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            activeOpacity={0.8}
          >
            {pathname === "/edit" ? (
              <View style={styles.activeCircle}>
                <MaterialIcons
                  name="person-outline"
                  size={24}
                  color="#fff"
                />
              </View>
            ) : (
              <MaterialIcons
                name="person-outline"
                size={24}
                color="#5EA5E8"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },

  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  changePhotoText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.accent,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  inputWrapper: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    fontSize: 15,
    color: COLORS.text,
  },

  saveButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
  },

  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },

  bottomBar: {
    backgroundColor: COLORS.bottomBar,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 8,
  },

  bottomItem: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  activeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});