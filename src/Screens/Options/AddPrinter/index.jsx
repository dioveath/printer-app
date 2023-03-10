import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Button, Icon } from "@rneui/themed";

export default function AddPrinter({ navigation }) {
  return (
    <>
      <View className="p-6 py-10 flex flex-row justify-between items-center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <View className="flex flex-row items-center justify-center gap-2">
          <Icon type='material-community' name='location-exit' style={{transform: [{ rotateY: '180deg'}]}}/>
          <Text className='font-nebula-bold text-lg'> Back </Text>
        </View>
        </TouchableOpacity>
      </View>
      <View className="h-[1px] bg-orange-500"/>
      <ScrollView className="relative flex-1 px-6 py-4">
        <Text className="font-nebula-semibold">Please check your printer with compatibility list. </Text>
        <Text className="font-nebula-semibold py-2">We Support: </Text>
        <Text className="font-nebula text-gray-600 py-2">
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
