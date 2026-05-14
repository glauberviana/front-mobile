import { MaterialIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import api, { clearAuthToken, getCachedToken } from "@/src/services/api";
import * as ImagePicker from "expo-image-picker";
import { useTasks } from "@/src/contexts/TasksContext";

const COLORS = {
  accent: "#5EA5E8",
  white: "#FFFFFF",
  background: "#F3F4F6",
  bottomBar: "#F8F8F8",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  error: "#EF4444",
};

export default function EditScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { clearTasksData } = useTasks();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get("/auth/me")
      .then((res) => {
        const user = res.data?.data?.user;
        if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
          setPhone(user.phone || "");
          if (user.avatar) {
            setAvatar(user.avatar);
          }
        }
      })
      .catch((err) => console.log("Erro ao buscar dados do perfil", err));
  }, []);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const bottomBarHeight = 60 + insets.bottom;

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 2) {
      return numbers;
    }

    if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }

    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  function handleSave() {
    let hasError = false;

    if (name.trim() === "") {
      setNameError("O nome não pode ficar vazio");
      hasError = true;
    } else {
      setNameError("");
    }

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      setEmailError("Digite um email válido");
      hasError = true;
    } else {
      setEmailError("");
    }

    const phoneNumbers = phone.replace(/\D/g, "");

    if (
      phoneNumbers.length > 0 &&
      phoneNumbers.length < 11
    ) {
      setPhoneError("Telefone incompleto");
      hasError = true;
    } else {
      setPhoneError("");
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("_method", "PUT");
    const submitData = async () => {
      try {
        if (avatar && !avatar.startsWith("http")) {
          const filename = avatar.split("/").pop() || "avatar.jpg";
          const match = /\.(\w+)$/.exec(filename);
          let type = match ? `image/${match[1]}` : `image/jpeg`;
          
          if (type === 'image/jpg') type = 'image/jpeg';

          if (Platform.OS === "web") {
            const res = await fetch(avatar);
            const blob = await res.blob();
            formData.append("avatar", blob, filename);
          } else {
            formData.append("avatar", {
              uri: avatar,
              name: filename,
              type,
            } as any);
          }
        }

        // getCachedToken() funciona mesmo quando o AsyncStorage está quebrado (Expo Go)
        const token = getCachedToken();
        const baseURL = api.defaults.baseURL || "http://192.168.1.7:8000/api";
        const url = `${baseURL}/auth/me`;
        
        console.log("📤 PROFILE SAVE - URL:", url);
        console.log("📤 PROFILE SAVE - Token presente?", !!token);
        console.log("📤 PROFILE SAVE - Avatar alterado?", avatar && !avatar.startsWith("http"));
        
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        });

        console.log("📤 PROFILE SAVE - Status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.log("📤 PROFILE SAVE - Erro body:", errorText);
          try {
            const errorData = JSON.parse(errorText);
            throw { response: { data: errorData } };
          } catch (parseErr) {
            throw new Error(`Servidor retornou status ${response.status}: ${errorText.substring(0, 200)}`);
          }
        }
        
        console.log("✅ PROFILE SAVE - Sucesso!");
        router.back();
      } catch (error: any) {
        console.log("❌ PROFILE SAVE - Erro completo:", error.message || error);
        const apiError = error.response?.data?.errors;
        if (apiError) {
          if (apiError.name) setNameError(apiError.name[0]);
          if (apiError.email) setEmailError(apiError.email[0]);
          if (apiError.phone) setPhoneError(apiError.phone[0]);
          if (apiError.avatar) Alert.alert("Erro na Foto", apiError.avatar[0]);
        } else {
           Alert.alert("Erro", `Não foi possível salvar o perfil.\n\n${error.message || 'Verifique os logs.'}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    submitData();
  }

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log("Erro no logout", err);
    } finally {
      clearTasksData();
      await AsyncStorage.removeItem("@TaskCycle:categories");
      await clearAuthToken();
      router.replace("/login");
    }
  };

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

        <ScrollView 
          style={styles.content} 
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  style={{ width: 110, height: 110, borderRadius: 55 }}
                />
              ) : (
                <MaterialIcons
                  name="person"
                  size={54}
                  color={COLORS.white}
                />
              )}
            </View>

            <TouchableOpacity activeOpacity={0.6} onPress={handlePickImage}>
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
                onChangeText={(text) => {
                  setName(text);

                  if (nameError) {
                    setNameError("");
                  }
                }}
                placeholder="Digite seu nome"
                placeholderTextColor="#9CA3AF"
                style={[
                  styles.input,
                  nameError ? styles.inputError : null,
                ]}
              />

              {nameError ? (
                <Text style={styles.errorText}>
                  {nameError}
                </Text>
              ) : null}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email</Text>

              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);

                  if (emailError) {
                    setEmailError("");
                  }
                }}
                placeholder="Digite seu email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.input,
                  emailError ? styles.inputError : null,
                ]}
              />

              {emailError ? (
                <Text style={styles.errorText}>
                  {emailError}
                </Text>
              ) : null}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Telefone</Text>

              <TextInput
                value={phone}
                onChangeText={(text) => {
                  setPhone(formatPhone(text));

                  if (phoneError) {
                    setPhoneError("");
                  }
                }}
                placeholder="Digite seu telefone"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                style={[
                  styles.input,
                  phoneError ? styles.inputError : null,
                ]}
              />

              {phoneError ? (
                <Text style={styles.errorText}>
                  {phoneError}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.5}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.6}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={20} color={COLORS.error} />
              <Text style={styles.logoutButtonText}>
                Sair da conta
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

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
            onPress={() => router.push("/home")}
          >
            {pathname === "/home" ? (
              <View style={styles.activeCircle}>
                <MaterialIcons
                  name="list"
                  size={22}
                  color="#fff"
                />
              </View>
            ) : (
              <MaterialIcons
                name="list"
                size={22}
                color="#5EA5E8"
              />
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
            {pathname === "/tasks/edit" ? (
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

  inputError: {
    borderColor: COLORS.error,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
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

  logoutButton: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },

  logoutButtonText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  bottomBar: {
    backgroundColor: COLORS.bottomBar,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-evenly",
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