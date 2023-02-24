import { View, Text, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
// import { BluetoothManager } from "react-native-bluetooth-escpos-printer";
import { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CompletedOrders from "./CompletedOrders";
import PendingOrders from "./PendingOrders";

const Tab = createMaterialTopTabNavigator();

export default function HomeScreen({ navigation }) {
  const [isBluetoothEnabled, setBluetoothEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      //   const enabled = await BluetoothManager.isBluetoothEnabled();
      setBluetoothEnabled(enabled);
    })();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Pending Orders"
        component={PendingOrders}
        options={{ tabBarLabel: "Pending Orders" }}
      />
      <Tab.Screen
        name="Completed Orders"
        component={CompletedOrders}
        options={{ tabBarLabel: "Completed Orders" }}
      />
    </Tab.Navigator>
  );
}
