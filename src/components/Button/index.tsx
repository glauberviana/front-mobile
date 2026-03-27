import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { styles } from "./styles";

// 1. Adicione o isLoading na interface
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading: boolean;
}

// 2. Receba o isLoading aqui nos parâmetros
export default function Button({ title, isLoading, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[rest.style, styles.button]}
      disabled={isLoading} // Desabilita o clique se estiver carregando
      {...rest}
    >
      {/* 3. Se estiver carregando, mostra o spinner, senão mostra o texto */}
      {isLoading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
