import { useRef, useEffect, useMemo } from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { useDebounce } from "./utils";

import Header from "./components/Header";
import Footer from "./components/Footer";

import styles from "./styles";

const screenHeight = Dimensions.get("window").height;
const height = screenHeight - 140;

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

  return (
    <View>
      <Header />
      <View style={[styles.center, { height: height }]}>
        <Animated.View style={animatedIcon}>
          <View
            style={[
              styles.padding_20,
              { backgroundColor: "#02d69d", borderRadius: 60 },
            ]}
          >
            <AntDesign name="check" size={65} color="#FFFF" />
          </View>
        </Animated.View>
        <Text style={[styles.marginTop_10, styles.bold, { color: "#02d69d" }]}>
          Compra realizada com sucesso
        </Text>
      </View>

      <Footer />
    </View>
  );
}
