import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { styles } from "./styles";

// Interface que estende as props do TouchableOpacity,
// permitindo reutilização do componente com flexibilidade
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading: boolean;
}

export default function Button({ title, isLoading, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      // Aplica estilos padrão + permite sobrescrita via props
      style={[rest.style, styles.button]}
      // Desabilita o botão durante o carregamento para evitar múltiplos cliques
      disabled={isLoading}
      {...rest}
    >
      {/* Exibe um indicador de carregamento ou o texto do botão */}
      {isLoading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
