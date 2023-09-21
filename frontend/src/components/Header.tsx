import { useMemo } from "react";
import { View, Image } from "react-native";
import styles from "../styles";

export default function Header() {
  const styleHeader = useMemo(
    () => [styles.fullWidth, styles.paddingTop_40, styles.alignItems_center],
    []
  );

  return (
    <View style={styleHeader}>
      <Image
        source={require("../../assets/icons/logo.png")}
        style={styles.headerLogo}
      />
    </View>
  );
}
