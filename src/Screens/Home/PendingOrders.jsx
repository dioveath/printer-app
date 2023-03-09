import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View, Text } from "react-native";
import OrderCard from "./components/OrderCard";
import { useListOrdersQuery, useUpdateOrderMutation } from "../../Redux/orders/ordersApiSlice";
import { LinearProgress } from "@rneui/themed";

const PendingOrders = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState();
  const { data, isLoading, isFetching, refetch } = useListOrdersQuery(null, { pollingInterval: 30000 });
  const [ updateOrder, { isLoading: isUpdating } ] = useUpdateOrderMutation();

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
    data?.data.forEach((item) => {
      if (item.attributes.status_id === 1) updateOrder({ id: item.id, status_id: 2 });
    });
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
