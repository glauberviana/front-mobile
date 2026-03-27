import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./styles";

// Extende as propriedades nativas do TextInput para permitir reutilização
// e adiciona props customizadas para label, erro e ícone
interface Props extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
}

export default function Input({ label, error, iconName, ...rest }: Props) {
  // Controla o estado de foco para alterar o estilo visual do input
  const [isFocused, setIsFocused] = useState(false);

  // Controla a visibilidade da senha (mostrar/ocultar)
  const [showPassword, setShowPassword] = useState(false);

  // Verifica se o input é do tipo senha
  const isPassword = rest.secureTextEntry;

  return (
    <View style={styles.container}>
      {/* Renderiza o label acima do campo, se existir */}
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,

          // Estilo aplicado quando o input está focado
          isFocused && { borderColor: "#3B6EDC", borderWidth: 2 },

          // Estilo aplicado quando há erro de validação
          error && { borderColor: "#ef4444", borderWidth: 2 },
        ]}
      >
        {/* Ícone exibido à esquerda do input */}
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
          // Alterna visibilidade da senha
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor="#9ca3af"
          // Atualiza estado de foco
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          // Remove underline padrão do Android
          underlineColorAndroid="transparent"
          {...rest}
        />

        {/* Ícone para mostrar/ocultar senha */}
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

      {/* Mensagem de erro exibida abaixo do input */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
