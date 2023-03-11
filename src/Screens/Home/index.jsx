import { View, Text, Button, Touchable, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/themed";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNetInfo } from "@react-native-community/netinfo";

import AllOrders from "./AllOrders";
import ActiveOrders from "./ActiveOrders";
import PendingOrders from "./PendingOrders";
import MyTabBar from "./components/MyTabBar";
import { SoundProvider } from "../../hooks/useNotifySound";
import { useContext } from "react";
import { SoundContext } from "../../hooks/useNotifySound";


const Tab = createMaterialTopTabNavigator();

const NotificationBar = () => {
  const { isPlaying, stopSound }  = useContext(SoundContext);
  if(!isPlaying) return <></>;
  return (
    <TouchableOpacity onPress={stopSound}>
    <View className='flex flex-row items-center justify-center bg-orange-500 px-4 py-2 rounded-full'>
      <Text className='text-white font-nebula-bold'>New Order!</Text>
      <Icon type='entypo' name='sound' size={18} color={'#fff'}/>
    </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { isConnected } = useNetInfo();

  return (
    <SoundProvider>
    <View className='w-full flex flex-row justify-between items-center bg-white p-6'>
      <Text className='text-2xl my-2 font-nebula-bold'> Orders </Text>
      <View className='flex flex-row items-center justify-center gap-x-2'> 
        <NotificationBar />
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
    </SoundProvider>    
  );
}