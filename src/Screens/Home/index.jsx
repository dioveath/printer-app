import { View, Text, Button } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen({ navigation }) {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-red-500 font-bold"> Home Screen </Text>
      <Button title="Go to Options" onPress={() => navigation.navigate('Option', {name: 'Sawroj'})}/>
      <StatusBar style="auto" />      
    </View>
  );
}
