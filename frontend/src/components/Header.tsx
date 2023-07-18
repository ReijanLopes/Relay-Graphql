import { View, Image } from "react-native";
import styles from "../styles";

export default function Header() {
  return (
    <View
      style={[styles.fullWidth, styles.paddingTop_40, styles.alignItems_center]}
    >
      <Image
        source={require("../../assets/icons/logo.png")}
        style={styles.headerLogo}
      />
    </View>
  );
}
