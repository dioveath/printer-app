import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "@rneui/base";

import { bleManager } from '../../lib/bleManager';
import { useDispatch } from "react-redux";
import { setBTStatus } from "../../Redux/connectivity/bluetoothSlice";
import { setPrinter } from "../../Redux/connectivity/printerSlice";

import HomeScreen from "../Home";
import OrderPage from "../Home/OrderPage";
import OptionScreen from "../Options";
import AddPrinter from "../Options/AddPrinter";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardNavigator} />
      <Stack.Screen name="AddPrinter" component={AddPrinter} />
      <Stack.Screen name="OrderPage" component={OrderPage} />
    </Stack.Navigator>
  );
};

const DashboardNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Icon name="home" />,
        }}
      />
      <Tab.Screen
        name="Options"
        component={OptionScreen}
        options={{
          title: "Options",
          tabBarIcon: ({ color, size }) => <Icon name="settings" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default function Dashboard() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      if (state === "PoweredOn") {
        dispatch(setBTStatus({ isEnabled: true }));
      } else {
        dispatch(setBTStatus({ isEnabled: false }));
        dispatch(setPrinter({ device: null }));
      }
    }, true);

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
