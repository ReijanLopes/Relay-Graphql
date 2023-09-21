import { View } from "react-native";
import styles from "../styles";
import { useMemo } from "react";

export default function Line() {
  const styleLine = useMemo(
    () => [styles.border_gray, styles.fullWidth, styles.borderWidth_1],
    []
  );
  return <View style={styleLine} />;
}
