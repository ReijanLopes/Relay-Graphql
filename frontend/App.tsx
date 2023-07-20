import { Suspense } from "react";
import { StatusBar } from "expo-status-bar";
import { NativeRouter, Route, Routes } from "react-router-native";
import { View, ActivityIndicator, StyleSheet } from "react-native";

import RelayEnvironment from "./relay/RelayEnvironment";
import PaymentMethod from "./src/PaymentMethod";
import PaymentPix from "./src/PaymentPix";
import PaymentCard from "./src/PaymentCard";
import ErrorBoundaryRetry from "./src/ErrorBoundaryRetry";

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
      <ErrorBoundaryRetry>
        <NativeRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<PaymentMethod />} />
              <Route path="/paymentPix" element={<PaymentPix />} />
              <Route path="/paymentCard" element={<PaymentCard />} />
            </Routes>
          </Suspense>
        </NativeRouter>
      </ErrorBoundaryRetry>
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
