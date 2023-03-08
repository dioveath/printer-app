import { useState } from "react";
import { FlatList } from "react-native";
import OrderCard from "./components/OrderCard";
import { useListOrdersQuery } from "../../Redux/orders/ordersApiSlice";
import { LinearProgress } from "@rneui/themed";

const PendingOrders = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState();
  const { data, isLoading, isFetching, refetch } = useListOrdersQuery();

  const renderItem = ({ item }) => {
    if (item.attributes.status.status_name === "Completed") return;
    const backgroundColor =
      item.id === selectedId ? "bg-red-500" : "bg-gray-300";
    const textColor = item.id === selectedId ? "text-white" : "text-black";

    console.log(item);

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
    return orderDate.getTime() === today.getTime() && item.attributes.status.status_name === "Received";
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

export default PendingOrders;
