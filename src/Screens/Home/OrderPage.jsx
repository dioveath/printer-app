import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useMemo } from "react";
import { Icon, Button, LinearProgress } from "@rneui/themed";
import { useGetOrderQuery, useUpdateOrderMutation } from "../../Redux/orders/ordersApiSlice";

const ICONS = {
  "Received": <Icon name="receipt" type='material-community' size={16} color={"lightblue"} />,
  "Pending": <Icon name="clock" type='material-community' size={16} color={"orange"} />,
  "Preparation": <Icon name="chef-hat" type='material-community' size={16} color={"green"} />,
  "Delivery": <Icon name="truck-delivery" type='material-community' size={16} color={"blue"} />,
  "Completed": <Icon name="check" type='material-community' size={16} color={"green"} />,
  "Missed": <Icon name="call-missed" type='material-community' size={16} color={"red"} />,
};

export default function OrderPage({ navigation, route }) {
  const { item: propsItem } = route.params;;
  const { data: item, isLoading, isFetching: isOrderFetching, isError, error } = useGetOrderQuery({ id: propsItem.id });
  const [updateOrder, { isLoading: isFetching }] = useUpdateOrderMutation();

  const canUpdate = item?.attributes.status_id < 5;  
  const canRevert = item?.attributes.status_id > 1;

  const isMissed = useMemo(() => {
    if(!item) return;
    if(item.attributes.status_name === 'Completed') return false;        
    const orderDate = new Date(item.attributes.order_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orderDate.getTime() < today.getTime();
  }, [item, item?.attributes.status_name])

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
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );    
  }

  if(isError){
    <View className="flex-1 flex flex-col justify-center items-center">
      <Text className='font-nebula-semibold'>{error}</Text>
    </View>    
  }

  return (
    <View className="flex-1">
      <View className="flex flex-row p-6 items-center gap-2">
        <Icon type='material-community' name='location-exit' style={{transform: [{ rotateY: '180deg'}]}} onPress={() => navigation.goBack()}/>
        <Text className='font-nebula-semibold'>Back to Orders</Text>
      </View>
      <ScrollView>
        <View className="w-full flex flex-row justify-between px-6 py-2">
          <View>
          <Text className='font-nebula-semibold text-orange-500 text-lg uppercase'> <Text className='text-black'>#{item.id}</Text> {item.attributes.order_type}</Text>
            <View className="flex flex-row justify-center items-center border-2 border-orange-500 px-4 py-[2px] rounded-full">
              <Text className='font-nebula'>{isMissed ? ICONS['Missed'] : ICONS[item.attributes.status.status_name]}</Text>
              <Text className='font-nebula'>{isMissed ? 'Missed' : item.attributes.status.status_name}</Text>
            </View>
          </View>
          <View className='h-10 w-10 border-orange-500 border-2 rounded-full flex flex-col justify-center items-center'>
            <Icon type="material-community" name="printer-outline" size={20} />
          </View>
          
        </View>
        <View className="w-full h-[2px] bg-orange-500" />
        { (isOrderFetching || isFetching) && <LinearProgress className="w-full" variant="indeterminate"/> }
        <View className="w-full flex flex-row justify-between py-2 px-6">
          <Text className='font-nebula'> Date: {new Date(item.attributes.order_date).toLocaleDateString()} </Text>
          <Text className='font-nebula'> Exp. Time: {item.attributes.order_time} </Text>
        </View>
        <View className="w-full h-[2px] bg-gray-200" />
        <View className="w-full flex flex-row justify-between py-2 px-6">
          <View>
            <Text className="font-nebula-bold">
              {item.attributes.first_name + ' ' + item.attributes.last_name}
            </Text>
            <Text numberOfLines={4} className="font-nebula w-52 text-gray-700">
              {item.attributes.formatted_address}
            </Text>
          </View>
          <Text className="font-nebula-semibold tracking-wider"> {item.attributes.telephone} </Text>
        </View>
        <View className="w-full h-[2px] bg-gray-200" />

        {item.attributes.order_menus.map((menu, index) => {
          return (
            <View className="w-full" key={menu.menu_id}>
              <View className="w-full flex flex-row justify-between py-1 px-6">
                <Text className="font-nebula-semibold">
                  {`${menu.quantity} x ${menu.name}`}
                </Text>
                <Text className="font-nebula-semibold">
                  {parseFloat(menu.price).toFixed(2)} &pound;{" "}
                </Text>
              </View>
              {menu.menu_options.map((option, index) => {
                return (
                  <View
                    key={option.menu_option_value_id}
                    className="w-full flex flex-row justify-between px-6"
                  >
                    <Text className="font-nebula text-gray-700 pl-4">
                      {`+ ${option.quantity} x ${option.order_option_name}`}
                    </Text>
                    <Text className="font-nebula text-gray-700 pl-4">
                      &pound; {parseFloat(option.order_option_price).toFixed(2)}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}

        <Text className="font-nebula-semibold px-6 py-2">
          Notes: {item.attributes.comment}
        </Text>

        <View className="w-full py-4 bg-gray-200">
        {item.attributes.order_totals.map((total, index) => {
          return (
            <View
              key={total.order_total_id}
              className="w-full flex flex-row justify-between px-6 py-[2px]"
            >
              <Text className={`font-nebula-semibold ${total.code === "total" && "text-[18px]"}`}>
                {total.title}
              </Text>
              <Text className={`font-nebula-semibold ${total.code === "total" && "text-[18px]"}`}>
                {parseFloat(total.value).toFixed(2)} &pound;
              </Text>
            </View>
          );
        })}
        </View>        
      </ScrollView>

      <View className="absolute bottom-0 w-full flex flex-row justify-between px-6 py-10 bg-gray-100">
        <Button titleStyle={{fontFamily: 'BRNebula-SemiBold'}} buttonStyle={{paddingHorizontal: 20 }} color="#f97316" radius={100} onPress={revertStatus} disabled={isFetching || !canRevert || isMissed}> Revert Order </Button>
        <Button titleStyle={{fontFamily: 'BRNebula-SemiBold'}} buttonStyle={{paddingHorizontal: 20 }} color="#F97316" radius={100} onPress={updateStatus} disabled={isFetching || !canUpdate || isMissed}> Forward Order </Button>
      </View>
    </View>
  );
}
