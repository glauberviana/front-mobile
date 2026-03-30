import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";

// Extende as propriedades nativas do TextInput
interface Props extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
}

export default function Input({ label, error, iconName, ...rest }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Verifica se o input é do tipo senha
  const isPassword = rest.secureTextEntry;

  return (
    <View style={styles.container}>
      {/* Label acima do campo */}
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        // O StyleSheet.flatten resolve o erro "CSSStyleDeclaration" no navegador
        style={StyleSheet.flatten([
          styles.inputContainer,
          isFocused && { borderColor: "#3B6EDC", borderWidth: 2 },
          error && { borderColor: "#ef4444", borderWidth: 2 },
        ])}
      >
        {/* Ícone à esquerda */}
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={20}
            color={isFocused ? "#3B6EDC" : "#9ca3af"}
            style={styles.icon}
          />
        )}

        {/* Campo de entrada principal */}
        <TextInput
          style={styles.input}
          placeholderTextColor="#9ca3af"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          underlineColorAndroid="transparent"
          {...rest}
          // Lógica para alternar visibilidade da senha
          secureTextEntry={isPassword && !showPassword}
        />

        {/* Ícone do Olhinho (apenas se for senha) */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 4, marginLeft: 8 }}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Mensagem de erro */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}