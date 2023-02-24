import { View, Text } from 'react-native';
import React from 'react';
import { Icon } from "@rneui/themed";
import { TouchableOpacity } from 'react-native';

export default function OrderCard({ item, onPress, backgroundColor, textColor}) {
  return (
    <TouchableOpacity onPress={onPress} className={`${backgroundColor} ${textColor} p-2 m-2 rounded-md`}>
      <View className='flex flex-row justify-between items-center'>
        <View className='flex flex-row items-center'>
            <Icon name='place'/>
            <Text numberOfLines={1} className='w-32'> 18 Nottingham, Loughbrough, LE11 1EU UK </Text>
        </View>
        <View className='flex flex-row items-center'>
            <Text className='bg-emerald-500 text-white px-4 py-2 rounded-md'> Already Delivered </Text>
            <Icon type='entypo' name='dots-three-vertical'/>
        </View>
      </View>
      <View>
        <Text> { item.title } </Text>
      </View>
      <View className='h-[1px] bg-gray-400/50 rounded-md'/>
    </TouchableOpacity>
  )
}