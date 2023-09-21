import { Text, Image, View } from "react-native";
import { Octicons } from "@expo/vector-icons";
import styles from "../styles";
import { useMemo } from "react";

export default function Footer() {
  const { container, text } = useMemo(
    () => ({
      container: [
        styles.footerContainer,
        styles.flexDirection_row,
        styles.center,
      ],
      text: [styles.footerText, styles.fontSize_12],
    }),
    []
  );

  return (
    <View style={container}>
      <View style={styles.marginR_3}>
        <Octicons name="shield-check" size={14} color="#b9b8b9" />
      </View>

      <Text style={text}>Pagamento 100% seguro via:</Text>
      <Image
        source={require("../../assets/icons/logo_gray.png")}
        style={styles.footerImage}
      />
    </View>
  );
}
