import { Suspense } from "react";
import { StatusBar } from "expo-status-bar";
import { NativeRouter, Route, Routes } from "react-router-native";
import { View, ActivityIndicator } from "react-native";

import RelayEnvironment from "./relay/RelayEnvironment";
import PaymentMethod from "./src/PaymentMethod";
import PaymentPix from "./src/PaymentPix";
import PaymentCard from "./src/PaymentCard";
import PaymentConfirmed from "./src/PaymentConfirmed";
import ErrorBoundaryRetry from "./src/ErrorBoundaryRetry";

import styles from "./src/styles";

const LoadingSpinner = () => {
  return (
    <View
      style={[
        styles.flex_1,
        styles.bgColor_white,
        styles.fullWidth,
        styles.center,
      ]}
    >
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
              <Route path="/pix" element={<PaymentPix />} />
              <Route path="/card" element={<PaymentCard />} />
              <Route path="/confirmed" element={<PaymentConfirmed />} />
            </Routes>
          </Suspense>
        </NativeRouter>
      </ErrorBoundaryRetry>
      <StatusBar style="auto" />
    </RelayEnvironment>
  );
}
