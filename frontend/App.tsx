import { Suspense } from "react";
import { StatusBar } from "expo-status-bar";
import { NativeRouter, Route, Routes } from "react-router-native";
import { View, ActivityIndicator, StyleSheet } from "react-native";

import RelayEnvironment from "./relay/RelayEnvironment";

const LoadingSpinner = () => {
  return (
    <View style={styles.loadingSpinner}>
      <ActivityIndicator size="large" color="#02D69D" />
    </View>
  );
};

export default function App() {
  return (
    <RelayEnvironment>
      <NativeRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/paymentPix" element={<></>} />
            <Route path="/paymentCard" element={<></>} />
          </Routes>
        </Suspense>
      </NativeRouter>

      <StatusBar style="auto" />
    </RelayEnvironment>
  );
}

const styles = StyleSheet.create({
  loadingSpinner: {
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
