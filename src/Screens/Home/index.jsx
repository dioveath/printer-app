import { View, Text, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CompletedOrders from "./CompletedOrders";
import PendingOrders from "./PendingOrders";
import { Icon } from "@rneui/base";
import { useNetInfo } from "@react-native-community/netinfo";

const Tab = createMaterialTopTabNavigator();

export default function HomeScreen({ navigation }) {
  const { isConnected } = useNetInfo();
    
  return (
    <>
    <View className='w-full flex flex-row justify-between items-center bg-white p-6'>
      <Text></Text>
      <Text className='text-2xl font-bold my-2'> Orders </Text>   
      <View className='flex flex-row items-center gap-2'> 
        <View className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}/>
        <Icon type='entypo' name='dots-three-horizontal' size={18} />
      </View>
    </View>
    <Tab.Navigator screenOptions={{
      swipeEnabled: false,
    }}>
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
    </>    
  );
}
