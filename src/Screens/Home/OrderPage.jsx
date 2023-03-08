import { View, Text, ScrollView } from "react-native";
import React, { useMemo } from "react";
import { Icon, Button, LinearProgress } from "@rneui/themed";
import { useGetOrderQuery, useUpdateOrderMutation } from "../../Redux/orders/ordersApiSlice";

export default function OrderPage({ navigation, route }) {
  const { item: propsItem } = route.params;;
  const { data: item, isLoading, isFetching: isOrderFetching, isError, error } = useGetOrderQuery({ id: propsItem.id });
  const [updateOrder, { isLoading: isFetching }] = useUpdateOrderMutation();

  const canUpdate = item?.attributes.status_id < 5;  
  const canRevert = item?.attributes.status_id > 1;

  const isMissed = useMemo(() => {
    if(!item) return;
    const orderDate = new Date(item.attributes.order_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orderDate.getTime() < today.getTime();
  }, [])

  const updateStatus = () => {
    console.log("Updating order status...");
    if(!item) return;
    if(!canUpdate) return;
    updateOrder({ id: item.id, status_id: item.attributes.status_id + 1 });
  };

  const revertStatus = () => {
    console.log("Reverting order status...");
    if(!item) return;
    if(!canRevert) return;
    updateOrder({ id: item.id, status_id: item.attributes.status_id - 1 });
  };

  if(isLoading || !item) {
    return (
      <View className="flex-1 flex flex-col justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );    
  }

  if(isError){
    <View className="flex-1 flex flex-col justify-center items-center">
      <Text>{error}</Text>
    </View>    
  }

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
            <View className="border-2 border-orange-500 px-4 py-[2px] rounded-full">
              <Text>{item.attributes.status.status_name}</Text>
            </View>
          </View>
          <View className='h-10 w-10 border-orange-500 border-2 rounded-full flex flex-col justify-center items-center'>
            <Icon type="material-community" name="printer-outline" size={20} />
          </View>
          
        </View>
        <View className="w-full h-[2px] bg-orange-500" />
        { (isOrderFetching || isFetching) && <LinearProgress className="w-full" variant="indeterminate"/> }
        <View className="w-full flex flex-row justify-between py-2 px-6">
          <Text> Date: {new Date(item.attributes.order_date).toLocaleDateString()} </Text>
          <Text> Exp. Time: {item.attributes.order_time} </Text>
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
        <Button color="#f97316" radius={100} onPress={revertStatus} disabled={isFetching || !canRevert}> Revert Order </Button>
        <Button color="#F97316" radius={100} onPress={updateStatus} disabled={isFetching || !canUpdate}> Forward Order </Button>
      </View>
    </View>
  );
}
