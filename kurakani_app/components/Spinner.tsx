import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Spinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4b5966" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
