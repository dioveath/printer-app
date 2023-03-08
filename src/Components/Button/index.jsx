import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function CustomButton({ ...props }) {
  return (
    <TouchableOpacity {...props}>
        <View className='flex flex-row items-center justify-center bg-[#F9A826] rounded-[10px] h-[50px]'>
            <Text className='text-white font-bold text-lg'> {props.children} </Text>
        </View>
    </TouchableOpacity>    
  )
}