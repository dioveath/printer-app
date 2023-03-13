import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useMemo, useState } from "react";
import { Icon, Button, LinearProgress, ButtonGroup } from "@rneui/themed";
import { useSelector } from "react-redux";

import { useGetOrderQuery, useUpdateOrderMutation } from "../../Redux/orders/ordersApiSlice";
import { CustomProgressIndicator } from "../../Components/CustomProgressIndicator";
import { printReceipt } from "../../lib/printReceipt";

const ICONS = {
  "Received": <Icon name="receipt" type='material-community' size={16} color={"lightblue"} />,
  "Pending": <Icon name="clock" type='material-community' size={16} color={"orange"} />,
  "Preparation": <Icon name="chef-hat" type='material-community' size={16} color={"green"} />,
  "Delivery": <Icon name="truck-delivery" type='material-community' size={16} color={"blue"} />,
  "Completed": <Icon name="check" type='material-community' size={16} color={"green"} />,
  "Missed": <Icon name="call-missed" type='material-community' size={16} color={"red"} />,
  "Canceled": <Icon name='close' type='material-community' size={16} color={"red"} />,
};

const RIGHT_BUTTON_LABELS = {
  "Received": "Start Order",
  "Pending": "Accept Order",
  "Preparation": "Out for Delivery",
  "Delivery": "Complete Order",
  "Completed": "Completed",
  "Missed": "Missed Order",
  "Canceled": "Canceled Order",
};

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

export default function OrderPage({ navigation, route }) {
  const { item: propsItem } = route.params;;
  const { data: item, isLoading, isFetching: isOrderFetching, isError, error } = useGetOrderQuery({ id: propsItem.id });
  const [updateOrder, { isLoading: isFetching }] = useUpdateOrderMutation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { domain } = useSelector((state) => state.setup);

  const { isEnabled } = useSelector((state) => state.bluetooth);
  const { device, status } = useSelector((state) => state.printer);
  const canPrint = (device && isEnabled && status?.connection === 'CONNECT' && status?.paper === 'PAPER_OK');  

  const canUpdate = item?.attributes.status_id < 5;  
  const canRevert = item?.attributes.status_id > 1;

  const isPending = useMemo(() => item?.attributes.status_id === 2, [item, item?.attributes.status_id]);  
  const isCanceled = useMemo(() => item?.attributes.status_id === 9, [item, item?.attributes.status_id]);
  const isCompleted = useMemo(() => item?.attributes.status_id === 5, [item, item?.attributes.status_id]);

  const leftButtonLabel = isPending ? 'Reject Order' : 'Cancel Order';
  
  const isMissed = useMemo(() => {
    if(!item) return;
    if(item.attributes.status_name === 'Completed') return false;        
    const orderDate = new Date(item.attributes.order_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orderDate.getTime() < today.getTime();
  }, [item, item?.attributes.status_name])

  const acceptOrder = async () => {
    if(!item) return;
    if(item.attributes.status_id != 2) return;

    const orderDate = new Date(item.attributes.invoice_date);
    orderDate.setMinutes(orderDate.getMinutes() + 30 + (10 * selectedIndex));

    const orderDateTime = formatDate(orderDate);
    const orderTime = orderDateTime.split(' ')[1];

    printReceipt(item, domain);
    updateOrder({ id: item.id, status_id: 3, order_time: orderTime});
  }

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

  const rejectStatus = () => {
    if(!item) return;
    if(item.attributes.status_id === 5) return;
    updateOrder({ id: item.id, status_id: 9 });
  }

  if(isLoading || !item) {
    return (
      <View className="flex-1 flex flex-col justify-center items-center">
        <CustomProgressIndicator/>
        <Text className='font-nebula'> Loading order... </Text>
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
      <TouchableOpacity onPress={() => navigation.goBack()}>
      <View className="flex flex-row p-6 items-center gap-2">
        <Icon type='material-community' name='location-exit' style={{transform: [{ rotateY: '180deg'}]}}/>
        <Text className='font-nebula-semibold'>Back to Orders</Text>
      </View>
      </TouchableOpacity>      
      <ScrollView className='mb-28'>
        <View className="w-full flex flex-row justify-between px-6 py-2">
          <View>
          <Text className='font-nebula-semibold text-orange-500 text-lg uppercase'> <Text className='text-black'>#{item.id}</Text> {item.attributes.order_type}</Text>
            <View className="flex flex-row justify-center items-center border-2 border-orange-500 px-4 py-[2px] rounded-full">
              <Text className='font-nebula px-1'>{isMissed ? ICONS['Missed'] : ICONS[item.attributes.status.status_name]}</Text>
              <Text className='font-nebula'>{isMissed ? 'Missed' : item.attributes.status.status_name}</Text>
            </View>
          </View>
            <TouchableOpacity onPress={() => { if(canPrint) printReceipt(item, domain); }}>
            <View className={`h-10 w-10 border-orange-500 border-2 rounded-full flex flex-col justify-center items-center ${canPrint ? 'border-orange-500' : 'border-gray-500'}`}>
              <Icon type="material-community" name="printer-outline" size={20} />
            </View>
            </TouchableOpacity>
            
          
        </View>
        <View className="w-full h-[2px] bg-orange-500" />
        { (isOrderFetching || isFetching) && <LinearProgress className="w-full" variant="indeterminate"/> }
        <View className="w-full flex flex-row justify-between py-2 px-6">
          <Text className='font-nebula'> Date: {new Date(item.attributes.order_date).toLocaleDateString()} </Text>
          <Text className='font-nebula'> Time: {item.attributes.order_time} </Text>
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
          <View className='flex flex-col items-end'>
          <Text className='font-nebula-semibold'> Payment: <Text className='uppercase'>{ item.attributes.payment }</Text> </Text>
          <Text className="font-nebula-semibold tracking-wider"> {item.attributes.telephone} </Text>
          </View>
          
        </View>
        <View className="w-full h-[2px] bg-gray-200" />

        {item.attributes.order_menus.map((menu, index) => {
          return (
            <View className="w-full" key={menu.order_menu_id}>
              <View className="w-full flex flex-row justify-between py-1 px-6">
                <Text className="font-nebula-semibold">
                  {`${menu.quantity} x ${menu.name}`}
                </Text>
                <Text className="font-nebula-semibold">
                  &pound; {parseFloat(menu.price).toFixed(2)} 
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
              <Text className='font-nebula-semibold text-xs px-6'>Note: {menu.comment}</Text>              
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
                &pound; {parseFloat(total.value).toFixed(2)}
              </Text>
            </View>
          );
        })}
        </View>        
      </ScrollView>

      <View className="absolute bottom-0 w-full flex flex-col justify-between px-6 py-10 gap-y-2">
        { isPending && <ButtonGroup className="w-full bg-orange-700"
          buttons={['30 MIN', '40 MIN', '50 MIN']}
          buttonStyle={{backgroundColor: '#F97316', borderRadius: 100, color: '#fff', fontFamily: 'Montserrat-SemiBold'}}
          textStyle={{fontFamily: 'Montserrat-SemiBold', color: '#fff'}}
          selectedButtonStyle={{backgroundColor: 'rgb(195, 65, 12)', borderRadius: 100, color: '#fff', fontFamily: 'Montserrat-SemiBold'}}
          containerStyle={{backgroundColor: 'transparent', border: 0, shadowColor: 'transparent'}}
          buttonContainerStyle={{border: 0, borderWidth: 0, shadowOffset: 0, shadowColor: 'transparent', backgroundColor: 'transparent'}}
          innerBorderStyle={{width: 0}}
          selectedIndex={selectedIndex}
          onPress={(value) => setSelectedIndex(value)}
        /> }
        <View className='flex flex-row justify-between'>
        <Button titleStyle={{fontFamily: 'BRNebula-SemiBold'}} 
          buttonStyle={{paddingHorizontal: 20 }} 
          color="#f97316" radius={100} 
          onPress={rejectStatus} 
          disabled={isFetching || !canRevert || isMissed || isCanceled || isCompleted }> { leftButtonLabel } </Button>
        <Button titleStyle={{fontFamily: 'BRNebula-SemiBold'}} 
          buttonStyle={{paddingHorizontal: 20 }} 
          color="#F97316" radius={100} 
          onPress={isPending ? acceptOrder : updateStatus} 
          disabled={isFetching || !canUpdate || isMissed}> { RIGHT_BUTTON_LABELS[isMissed ? "Missed" : item.attributes.status.status_name]} </Button>
        </View>

      </View>
    </View>
  );
}
