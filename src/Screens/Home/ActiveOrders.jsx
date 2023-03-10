import { View, Text } from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import OrderCard from "./components/OrderCard";
import { useListOrdersQuery } from "../../Redux/orders/ordersApiSlice";
import { LinearProgress } from "@rneui/themed";

const ActiveOrders = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState();
  const { data, isLoading, isFetching, refetch } = useListOrdersQuery();

  const renderItem = ({ item }) => {
    if (item.attributes.status.status_name === "Completed") return;
    if (item.attributes.status.status_id === 9) return; // canceled
    if (item.attributes.status.status_id === 2) return; // pending
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

  const filteredData = data?.data.filter((item) => {
    const orderDate = new Date(item.attributes.order_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime() && item.attributes.status.status_name !== "Completed" && item.attributes.status.status_name !== "Received";
  });

  return (
    <>
      {isLoading && <LinearProgress value={"inderteminate"} />}
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

export default ActiveOrders;
