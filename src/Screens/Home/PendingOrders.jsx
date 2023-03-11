import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity } from "react-native";
import { Icon } from '@rneui/themed'
import OrderCard from "./components/OrderCard";
import { useListOrdersQuery, useUpdateOrderMutation } from "../../Redux/orders/ordersApiSlice";
import { SoundContext } from "../../hooks/useNotifySound";


const PendingOrders = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState();
  const { data, isLoading, isFetching, refetch } = useListOrdersQuery(null, { pollingInterval: 30000 });
  const [ updateOrder, { isLoading: isUpdating } ] = useUpdateOrderMutation();
  const { playSound, stopSound, isPlaying } = useContext(SoundContext);

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

  useEffect(() => {
    (async() => {
        data?.data.forEach(async (item) => {
        if (item.attributes.status_id === 1) {
          try { 
            await updateOrder({ id: item.id, status_id: 2 }).unwrap();
            playSound();
          } catch(e){
            console.log(e);
          }
        }
      });      
    })();

    return () => {
      // stopSound();
    }
  }, [data]);

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
      <NotificationPanel status={isPlaying} stopSound={stopSound}/>

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


const NotificationPanel = ({ status, stopSound }) => {
  return ( status ? 
        <TouchableOpacity className='flex-1 w-full h-full justify-center absolute top-0 bottom-0 z-10 bg-gray-100/50' 
        onPress={async () => {
          await stopSound();
        }}>
          <View className='flex-1 w-full h-full justify-center items-center'>
            <Icon name='notifications-off' type="ionicon" color={'#f97316'} size={32}/>
          </View>
        </TouchableOpacity> 
        : <></>
  );
}

export default PendingOrders;
