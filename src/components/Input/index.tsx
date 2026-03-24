import { Text, TextInput, View } from "react-native";
import styles from "./styles";

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
};

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
  secureTextEntry = false,
}: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
