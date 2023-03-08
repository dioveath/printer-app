import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Icon, Button } from "@rneui/themed";

export default function OrderPage({ navigation, route }) {
  const { item } = route.params;
  return (
    <View className="flex-1">
      <View className="flex flex-row p-6 items-center gap-2">
        <Icon type='material-community' name='location-exit' style={{transform: [{ rotateY: '180deg'}]}} onPress={() => navigation.goBack()}/>
        <Text>Back to Orders</Text>
      </View>
      <ScrollView>
        <View className="w-full flex flex-row justify-between px-6 py-2">
          <View>
          <Text className='text-orange-500 text-lg'> <Text className='text-black'>#{item.id}</Text>  Order </Text>
            <Text className="border-2 border-orange-500 px-4 py-[2px] rounded-full">
              Online Payment
            </Text>
          </View>
          <View className='h-10 w-10 border-orange-500 border-2 rounded-full flex flex-col justify-center items-center'>
            <Icon type="material-community" name="printer-outline" size={20} />
          </View>
          
        </View>
        <View className="w-full h-[2px] bg-orange-500" />
        <View className="w-full flex flex-row justify-between py-2 px-6">
          <Text> Date: {new Date().toLocaleDateString()} </Text>
          <Text> Exp. Time: {new Date().toLocaleTimeString()} </Text>
        </View>
        <View className="w-full h-[2px] bg-gray-200" />
        <View className="w-full flex flex-row justify-between py-2 px-6">
          <View>
            <Text className="font-bold">
              {item.attributes.first_name + item.attributes.last_name}
            </Text>
            <Text numberOfLines={4} className="w-52 text-gray-700">
              {item.attributes.formatted_address}
            </Text>
          </View>
          <Text className="font-bold"> {item.attributes.telephone} </Text>
        </View>
        <View className="w-full h-[2px] bg-gray-200" />

        {item.attributes.order_menus.map((menu, index) => {
          return (
            <View className="w-full" key={menu.menu_id}>
              <View className="w-full flex flex-row justify-between py-1 px-6">
                <Text className="font-bold">
                  {`${menu.quantity} x ${menu.name}`}
                </Text>
                <Text className="font-bold">
                  {parseFloat(menu.price).toFixed(2)} &pound;{" "}
                </Text>
              </View>
              {menu.menu_options.map((option, index) => {
                return (
                  <View
                    key={option.menu_option_value_id}
                    className="w-full flex flex-row justify-between px-6"
                  >
                    <Text className="text-gray-700 pl-4">
                      {`+ ${option.quantity} x ${option.order_option_name}`}
                    </Text>
                    <Text className="text-gray-700 pl-4">
                      &pound; {parseFloat(option.order_option_price).toFixed(2)}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}

        <Text className="font-bold px-6 py-2">
          Notes: {item.attributes.comment}
        </Text>

        <View className="w-full py-4 bg-gray-200">
        {item.attributes.order_totals.map((total, index) => {
          return (
            <View
              key={total.order_total_id}
              className="w-full flex flex-row justify-between px-6 py-[2px]"
            >
              <Text className={`font-bold ${total.code === "total" && "text-[18px]"}`}>
                {total.title}
              </Text>
              <Text className={`font-bold ${total.code === "total" && "text-[18px]"}`}>
                {parseFloat(total.value).toFixed(2)} &pound;
              </Text>
            </View>
          );
        })}
        </View>        
      </ScrollView>

      <View className="absolute bottom-0 w-full flex flex-row justify-between px-6 py-10 bg-gray-100">
        {/* <View className="w-full"> <Text> Revert Order </Text> </View> */}
        {/* <View className="w-full"> <Text> Forward Order </Text> </View> */}
        <View className='border-[2px] border-orange-500 px-6 py-2 rounded-full'>
          <Text className='text-orange-500 font-bold'> Revert Order </Text>
        </View>
        <View className='bg-orange-500 px-6 py-2 rounded-full'>
          <Text className='text-white font-bold'> Forward Order </Text>
        </View>        
        
      </View>
    </View>
  );
}
