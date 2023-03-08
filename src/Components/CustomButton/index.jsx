import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({ ...props }) => {
  const { type } = props;
  const getButtonStyle = (type) => type === 'outlined' ? 'border-[2px] border-orange-500' : 'bg-orange-500';
  const getTextStyle = (type) => type === 'outlined' ? 'text-orange-500' : 'text-white';

  return (
    <TouchableOpacity {...props}>
        <View className={`flex flex-row items-center justify-center rounded-full py-1 px-6 ${getButtonStyle(type)}`}>
            <Text className={`${getTextStyle(type)} font-bold`}> {props.children} </Text>
        </View>
    </TouchableOpacity>    
  )
}

export { CustomButton };