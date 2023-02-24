import { View, Text } from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";

const mockData = [
  {
    id: "1",
    title: "Completed Orders",
  },
  {
    id: "2",
    title: "Exit Orders",
  },
  {
    id: "3",
    title: "Know Orders",
  },
];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} className={`${backgroundColor}`}>
    <Text className={`${textColor}`}> {item.title} </Text>
  </TouchableOpacity>
);

const CompletedOrders = () => {
  const [selectedId, setSelectedId] = useState();
  const renderItem = ({ item }) => {
    const backgroundColor =
      item.id === selectedId ? "bg-red-500" : "bg-gray-300";
    const textColor = item.id === selectedId ? "text-white" : "text-black";

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={textColor}
      />
    );
  };

  return (
    <FlatList
      data={mockData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      extraData={selectedId}
    />
  );
};

export default CompletedOrders;
