import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Button, Icon } from "@rneui/themed";

export default function AddPrinter({ navigation }) {
  return (
    <>
        <View className="flex flex-row items-center p-4">
            <Icon type='materialicons' name="arrow-back-ios" size={30} onPress={() => navigation.goBack(null)}/>
            <Text className='text-lg font-bold'> Back </Text>
        </View>
      <ScrollView className="relative flex-1 px-4">
        <Text className="text-lg">Connect a thermal printer to this app.</Text>
        <Text className="text-lg font-bold">We Support: </Text>
        <Text className="text-gray-600">
          EU-m30 ✓ TM-T20X ✓ TM-T60 ✓ TM-H6000IV-DT ✓ TM-T70 ✓ TM-H6000V ✓
          TM-T70-i ✓ TM-L100 ✓ TM-T70II ✓ TM-L90 Liner-Free Label ✓ TM-T70II-DT
          ✓ TM-m10 ✓ TM-T70II-DT2 ✓ TM-m30 ✓ TM-T81II ✓ TM-m30II ✓ TM-T81III ✓
          TM-m30II-H ✓ TM-T82 ✓ TM-m30II-NT ✓ TM-T82II ✓ TM-m30II-S ✓ TM-T82II-i
          ✓ TM-m30II-SL ✓ TM-T82III ✓ TM-m30III ✓ TM-T82IIIL ✓ TM-m30III-H ✓
          TM-T82X ✓ TM-m50 ✓ TM-T83II ✓ TM-P20 ✓ TM-T83II-i ✓ TM-P20II ✓
          TM-T83III ✓ TM-P60 ✓ TM-T88V ✓ TM-P60II ✓ TM-T88V-i ✓ TM-P80 ✓
          TM-T88V-DT ✓ TM-P80II ✓ TM-T88VI ✓ TM-T100 ✓ TM-T88VI-iHUB ✓ TM-T20 ✓
          TM-T88VII ✓ TM-T20II (**7 model) ✓ TM-T88VI-DT2 ✓ TM-T20II-i ✓
          TM-T90II ✓ TM-T20II-m ✓ TM-U220 ✓ TM-T20III ✓ TM-U220-i ✓ TM-T20IIIL ✓
          TM-U330
        </Text>
      </ScrollView>
      {/* <View className="w-full absolute bottom-0 p-4">
        <Button className=""> Add Printer</Button>
      </View> */}
    </>
  );
}
