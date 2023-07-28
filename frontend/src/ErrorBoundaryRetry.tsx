import React from "react";
import { Text, View, Pressable, Dimensions } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import Header from "./components/Header";

import styles from "./styles";

const screenHeight = Dimensions.get("window").height;
const height = screenHeight - 200;

type Props = {
  children: React.ReactNode;
};
type State = {
  error: Error;
};
class ErrorBoundaryRetry extends React.Component<Props, State> {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return {
      error,
    };
  }

  render() {
    const { error } = this.state;

    if (error != null) {
      return (
        <View
          style={[styles.marginTopBottom_20, styles.fullWidth, styles.flex_1]}
        >
          <Header />

          <View
            style={[
              styles.flex_1,
              styles.bgColor_white,
              styles.center,
              styles.padding_10,
            ]}
          >
            <Foundation
              name="alert"
              size={70}
              color="red"
              style={[styles.padding_10]}
            />

            <Text>Lamentamos o inconveniente</Text>
            <Text style={styles.marginBottom_15}>mas ouve um erro</Text>
            <Pressable onPress={() => this.setState({ error: null })}>
              <AntDesign name="reload1" size={20} color="black" />
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryRetry;
