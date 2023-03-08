import { useState } from "react";
import { FlatList } from "react-native";
import OrderCard from "./components/OrderCard";
import { useListOrdersQuery } from "../../Redux/orders/ordersApiSlice";
import { LinearProgress } from "@rneui/themed";

const AllOrders = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState();
  const { data, isLoading, isFetching, refetch } = useListOrdersQuery();

  const renderItem = ({ item }) => {
    // if (item.attributes.status.status_name !== "Completed") return;
    const backgroundColor =
      item.id === selectedId ? "bg-gray-500" : "bg-white";
    const textColor = item.id === selectedId ? "text-white" : "text-black";

    return (
      <OrderCard
        item={item}
        onPress={() => navigation.navigate("OrderPage", { item }) }
        backgroundColor={backgroundColor}
        textColor={textColor}
      />
    );
  };

  return (
    <>
      {isLoading && <LinearProgress value={"inderteminate"} />}
      {!isLoading && data && (
        <FlatList
          data={data?.data}
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

export default AllOrders;
