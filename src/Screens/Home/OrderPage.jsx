import { View, Text } from "react-native";
import React from "react";

export default function OrderPage({ navigation, route }) {
  const { item } = route.params;
  return (
    <View>
      <Text>OrderPage</Text>
    </View>
  );
}
