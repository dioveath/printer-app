import { View, Text, ActivityIndicator } from "react-native";
import React, { useMemo, useState } from "react";
import { Icon, Button, ListItem, LinearProgress } from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import { useUpdateOrderMutation } from "../../../Redux/orders/ordersApiSlice";
import { useSelector } from "react-redux";
import { printReceipt } from "../../../lib/printReceipt";

const DELIVERY_STATUS = [
  "Empty",
  "Received",
  "Pending",
  "Preparation",
  "Delivery",
  "Completed",
];

const ICONS = {
  "Received": <Icon name="receipt" type='material-community' size={12} color={"lightblue"} />,
  "Pending": <Icon name="clock" type='material-community' size={12} color={"orange"} />,
  "Preparation": <Icon name="chef-hat" type='material-community' size={12} color={"green"} />,
  "Delivery": <Icon name="truck-delivery" type='material-community' size={12} color={"blue"} />,
  "Completed": <Icon name="check" type='material-community' size={12} color={"green"} />,
  "Missed": <Icon name="call-missed" type='material-community' size={12} color={"red"} />,
  "Canceled": <Icon name='close' type='material-community' size={16} color={"red"} />,  
};

export default function OrderCard({
  item,
  onPress,
  backgroundColor,
  textColor,
}) {
  const { device, status } = useSelector((state) => state.printer);
  const { isEnabled: enabled } = useSelector((state) => state.bluetooth);
  const isConnected = (device && enabled && status?.connection === 'CONNECT');
  
  const [updateOrder, { isLoading: isFetching }] = useUpdateOrderMutation();

  const isMissed = useMemo(() => {
    if(item.attributes.status_name === 'Completed') return false;
    const orderDate = new Date(item.attributes.order_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orderDate.getTime() < today.getTime();
  }, [])

  const updateStatus = () => {
    console.log("Updating order status...");
    updateOrder({ id: item.id, status_id: item.attributes.status_id + 1 });
  };

  const revertStatus = () => {
    console.log("Reverting order status...");
    updateOrder({ id: item.id, status_id: item.attributes.status_id - 1 });
  };

  const findTotal = (order) => {
    const total = item.attributes.order_totals.find(
      (o) => o.title === "Order Total"
    );
    return total?.value && parseFloat(total.value).toFixed(2);
  };

  const orderStatus = item.attributes.status.status_name;

  return (
    <ListItem.Swipeable
      onPress={onPress}
      className={`${backgroundColor} text-black border-b-[1px] border-gray-100`}
      rightContent={(reset) => {
        return (
          <TouchableOpacity onPress={() => { reset(); if(isConnected) printReceipt(item, "https://sliceup.pizza/assets/media/uploads/logo%203.png"); }}>
          <View
            className={
              `w-full h-full flex flex-row items-center justify-center ${isConnected ? "bg-orange-500" : "bg-gray-400"}`
            }
          >
            <Icon
              name={isConnected ? "printer" : "printer-off"}
              type="material-community"
              size={32}
              color={"white"}
            />
          </View>
          </TouchableOpacity>          
        );
      }}
      // leftContent={(reset) => {
      //   return (
      //     <TouchableOpacity onPress={() => {
      //       if(isMissed) { reset(); return; }
      //       if(orderStatus === 'Completed') return;
      //       updateStatus();
      //     }} disabled={!(orderStatus !== 'Completed')}>
      //     <View onPress={() => { console.log("fdsaadsf"); }}
      //     className={`w-full h-full flex flex-row items-center justify-center 
      //     ${orderStatus === 'Completed' ? 'bg-green-500' : 'bg-orange-500'}`}>
      //       { isFetching && <ActivityIndicator color={'white'}/> }
      //       { !isFetching && <Icon name={orderStatus === 'Completed' ? 'check' : 'update'} type="material-comunity"
      //         size={32}
      //         color={"white"}
      //       /> }
      //     </View>
      //     </TouchableOpacity>
      //   )
      // }}
    >
      <ListItem.Content className="w-full flex flex-row justify-between">
        <View className="w-full flex flex-row items-center justify-between gap-2">
          <View className='flex flex-col'>
            <Text className='font-nebula text-orange-500 uppercase'> <Text className='text-black'>#{item.id}</Text> {item.attributes.order_type} </Text>
            <Text numberOfLines={1} className="font-nebula-bold w-52">
                {item.attributes.formatted_address}
            </Text>          
          </View>
          
          <View className="flex flex-col items-end gap-1">
            <Text className="font-nebula-semibold text-gray-700">&pound; {findTotal(item)}</Text>            
            <View className="flex flex-row items-center border-[1px] border-orange-500 rounded-full px-2 py-1">
              { isMissed ? ICONS['Missed'] : ICONS[orderStatus] }
              <Text className={"font-nebula text-xs " + (isMissed ? "text-red-500" : "text-gray-800")}> {isMissed ? "Missed" : orderStatus} </Text>
            </View>
          </View>
        </View>

      </ListItem.Content>
    </ListItem.Swipeable>
  );
}