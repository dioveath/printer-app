import { View, Text } from "react-native";
import React from "react";
import { Icon, Button } from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import { useUpdateOrderMutation } from "../../../Redux/orders/ordersApiSlice";

const DELIVERY_STATUS = [
  "Empty",
  "Received",
  "Pending",
  "Preparation",
  "Delivery",
  "Completed",
];

export default function OrderCard({
  item,
  onPress,
  backgroundColor,
  textColor,
}) {
  const [updateOrder, { isFetching }] = useUpdateOrderMutation();

  const updateStatus = () => {
    console.log("Updating");
    updateOrder({id: item.id, status_id: item.attributes.status_id+1});
  }
  
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${backgroundColor} ${textColor} p-2 m-2 rounded-md`}
    >
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center">
          <Icon name="place" />
          <Text numberOfLines={1} className="w-32">
            {item.attributes.formatted_address}
          </Text>
        </View>
        <View className="flex flex-row items-center">
          <Text className="bg-emerald-500 text-white px-4 py-2 rounded-md">
            {item.attributes.status.status_name}
          </Text>
          <Icon type="entypo" name="dots-three-vertical" />
        </View>
      </View>
      <View>
        <Text>
          {item.attributes.first_name} {item.attributes.last_name}{" "}
        </Text>
      </View>
      <View className="h-[1px] bg-gray-400/50 rounded-md" />
      <View>
        <Text className="font-bold"> Orders </Text>
      </View>
      <Button> Print Receipt </Button>
      {item.attributes.status_id !== 5 && (
        <Button color={'secondary'} onPress={updateStatus} loading={isFetching}>
          {DELIVERY_STATUS[item.attributes.status_id + 1]}
        </Button>
      )}
    </TouchableOpacity>
  );
}
