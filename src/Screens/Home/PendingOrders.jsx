import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity } from "react-native";
import { Icon } from '@rneui/themed'
import OrderCard from "./components/OrderCard";
import { useListOrdersQuery, useUpdateOrderMutation } from "../../Redux/orders/ordersApiSlice";
import { LinearProgress } from "@rneui/themed";
import { Audio } from "expo-av";

const PendingOrders = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState();
  const { data, isLoading, isFetching, refetch } = useListOrdersQuery(null, { pollingInterval: 30000 });
  const [ updateOrder, { isLoading: isUpdating } ] = useUpdateOrderMutation();
  const [notifySound, setNotifySound] = useState(null);


  const renderItem = ({ item }) => {
    if (item.attributes.status.status_name === "Completed") return;
    const backgroundColor =
      item.id === selectedId ? "bg-red-500" : "bg-gray-300";
    const textColor = item.id === selectedId ? "text-white" : "text-black";

    return (
      <OrderCard
        item={item}
        onPress={() => navigation.navigate("OrderPage", { item })}
        backgroundColor={backgroundColor}
        textColor={textColor}
      />
    );
  };

  
  const playSound = async () => {
    if(notifySound) return;
    const { sound } = await Audio.Sound.createAsync(require('../../../assets/sounds/notification.mp3'));    
    await sound.setVolumeAsync(1.0);
    await sound.setIsLoopingAsync(true);
    await sound.playAsync();    
    setNotifySound(sound);
  };

  useEffect(() => {
    (async() => {
  
      data?.data.forEach(async (item) => {
        if (item.attributes.status_id === 1) {
          try { 
            await updateOrder({ id: item.id, status_id: 2 }).unwrap();
            await playSound();
          } catch(e){
            console.log(e);
          }
        }
      });      
    })();

    return () => { 
      notifySound?.stopAsync();
      notifySound?.unloadAsync(); 
    }
  }, [data])  

  const filteredData = data?.data.filter((item) => {
    const orderDate = new Date(item.attributes.order_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime() && item.attributes.status.status_name === "Pending";
  });

  return (
    <>
      {isLoading && <View className='flex-1 justify-center'>
          <ActivityIndicator color={'#f97316'} size={'large'}/>
        </View>}
      { notifySound && 
        <TouchableOpacity className='flex-1 w-full h-full justify-center absolute top-0 bottom-0 z-10 bg-gray-100/50' onPress={() => {
          notifySound?.stopAsync() 
          notifySound?.unloadAsync();
          setNotifySound(null);
        }}>
          <View className='flex-1 w-full h-full justify-center items-center'>
            <Icon name='notifications-off' type="ionicon" color={'#f97316'} size={32}/>
          </View>
        </TouchableOpacity> 
        }
      {!isLoading && data && (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
          refreshing={isFetching}
          onRefresh={refetch}
        />
      )}
    </>
  );
};

export default PendingOrders;
