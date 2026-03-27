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

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
}

export default function Input({ label, error, iconName, ...rest }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = rest.secureTextEntry;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && { borderColor: "#3B6EDC", borderWidth: 2 },
          error && { borderColor: "#ef4444", borderWidth: 2 },
        ]}
      >
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={20}
            color={isFocused ? "#3B6EDC" : "#9ca3af"}
            style={styles.icon}
          />
        )}

        <TextInput
          style={styles.input}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor="#9ca3af"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          underlineColorAndroid="transparent"
          {...rest}
        />

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

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
