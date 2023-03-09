import { View, Text, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Icon } from "@rneui/base";
import { useNetInfo } from "@react-native-community/netinfo";
import { useFonts } from "expo-font";

import AllOrders from "./AllOrders";
import ActiveOrders from "./ActiveOrders";
import PendingOrders from "./PendingOrders";
import MyTabBar from "./components/MyTabBar";
import { useEffect } from "react";


const Tab = createMaterialTopTabNavigator();

export default function HomeScreen({ navigation }) {
  const { isConnected } = useNetInfo();
  // const [loaded] = useFonts({
  //   "NebulaBold": require("../../../assets/fonts/BRNebula-Thin.ttf"),
  //   "Nebula-Regular": require("../../../assets/fonts/BRNebula-Regular.ttf")
  // });

  return (
    <>
    <View className='w-full flex flex-row justify-between items-center bg-white p-6'>
      <Text className='text-2xl my-2 font-nebula-bold'> Orders </Text>
      <View className='flex flex-row items-center gap-2'> 
        <View className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'border-[1px] border-green-500'}`}/>
        {/* <Icon type='entypo' name='dots-three-horizontal' size={18} /> */}
      </View>
    </View>
    
    <Tab.Navigator 
    tabBar={props => <MyTabBar {...props}/> }
    screenOptions={{
      swipeEnabled: false,
    }}>
      <Tab.Screen
      name="Pending Orders"
      component={PendingOrders}
      options={{ tabBarLabel: "Pending" }}
      />
      <Tab.Screen
        name="Active Orders"
        component={ActiveOrders}
        options={{ tabBarLabel: "In-Progress" }}
      />
      <Tab.Screen
        name="All Orders"
        component={AllOrders}
        options={{ tabBarLabel: "All" }}
      />
    </Tab.Navigator>
    </>    
  );
}