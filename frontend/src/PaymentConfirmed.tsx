import { useRef, useEffect, useMemo } from "react";
import { View, Text, Animated } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { useDebounce } from "./utils";

import Header from "./components/Header";
import Footer from "./components/Footer";

import styles from "./styles";

export default function PaymentConfirmed() {
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimationWithDelay = () => {
      Animated.timing(animated, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();
    };

    const timerId = useDebounce(() => startAnimationWithDelay(), 500);
    timerId();
  }, []);

  const animatedIcon = useMemo(
    () => ({
      opacity: animated,
      transform: [
        {
          scale: animated.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          }),
        },
      ],
    }),
    [animated]
  );

  const { containerAnimation, circle, text } = useMemo(
    () => ({
      containerAnimation: [styles.center, styles.flex_1],
      circle: [styles.padding_20, styles.validatePayment],
      text: [styles.marginTop_10, styles.bold, styles.color_green],
    }),
    []
  );

  return (
    <View style={styles.flex_1}>
      <Header />
      <View style={containerAnimation}>
        <Animated.View style={animatedIcon}>
          <View style={circle}>
            <AntDesign name="check" size={65} color="#FFFF" />
          </View>
        </Animated.View>
        <Text style={text}>Compra realizada com sucesso</Text>
      </View>

      <Footer />
    </View>
  );
}
