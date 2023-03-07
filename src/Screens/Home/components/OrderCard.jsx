import { View, Text } from "react-native";
import React, { useMemo, useState } from "react";
import { Icon, Button, ListItem, LinearProgress } from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import { useUpdateOrderMutation } from "../../../Redux/orders/ordersApiSlice";
import EscPosPrinter, {
  getPrinterSeriesByName,
} from "react-native-esc-pos-printer";
import { useSelector } from "react-redux";

const DELIVERY_STATUS = [
  "Empty",
  "Received",
  "Pending",
  "Preparation",
  "Delivery",
  "Completed",
];

const ICONS = {
  "Received": <Icon name="receipt" type='material-community' size={12} color={"lightblue"} />,
  "Pending": <Icon name="clock" type='material-community' size={12} color={"orange"} />,
  "Preparation": <Icon name="chef-hat" type='material-community' size={12} color={"green"} />,
  "Delivery": <Icon name="truck-delivery" type='material-community' size={12} color={"blue"} />,
  "Completed": <Icon name="check" type='material-community' size={12} color={"green"} />,
  "Missed": <Icon name="call-missed" type='material-community' size={12} color={"red"} />,
};

export default function OrderCard({
  item,
  onPress,
  backgroundColor,
  textColor,
}) {
  const { device, status } = useSelector((state) => state.printer);
  const { isEnabled: enabled } = useSelector((state) => state.bluetooth);
  const isConnected = (device && enabled && status.connection === 'CONNECT');
  
  const [updateOrder, { isLoading: isFetching }] = useUpdateOrderMutation();

  const isMissed = useMemo(() => {
    const orderDate = new Date(item.attributes.order_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orderDate.getTime() < today.getTime();
  }, [])

  const updateStatus = () => {
    console.log("Updating order status...");
    updateOrder({ id: item.id, status_id: item.attributes.status_id + 1 });
  };

  const revertStatus = () => {
    console.log("Reverting order status...");
    updateOrder({ id: item.id, status_id: item.attributes.status_id - 1 });
  };

  const printReceipt = () => {
    if (!isConnected) return;
    console.log("Printing receipt...");
    // check if there is a active connection to printer
    // if not, navigate to options screen
    try {
      const printing = new EscPosPrinter.printing();
      const printObj = printing
        .initialize()
        .align("center")
        .image(
          { uri: "https://sliceup.pizza/assets/media/uploads/logo%203.png" },
          { width: 400 }
        )
        .newline()
        .size(1, 1)
        .textLine(48, {
          left: `Date: ${new Date(
            item.attributes.order_date
          ).toLocaleString()}`,
          right: `Order ID: ${item.id}`,
          gapSymbol: " ",
        })
        .newline()
        .textLine(48, {
          left: `Name: ${item.attributes.first_name} ${item.attributes.last_name}`,
          right: `Phone: ${item.attributes.telephone}`,
          gapSymbol: " ",
        })
        .textLine(48, {
          left: `Address: ${item.attributes.formatted_address}`,
          right: `Payment: ${item.attributes.payment}`,
          gapSymbol: " ",
        })
        .textLine(48, { left: "-", right: "-", gapSymbol: "-" })
        .newline();

      item.attributes.order_menus.forEach((item) => {
        printObj.textLine(48, {
          left: `${item.quantity}x ${item.name}`,
          right: `${item.price}`,
          gapSymbol: ".",
        });

        item.menu_options.forEach((options) => {
          printObj.textLine(48, {
            left: `+ ${options.quantity}x ${options.order_option_name}`,
            right: `${options.order_option_price}`,
            gapSymbol: ".",
          });
        });
      });

      printObj.textLine(48, { left: "=", right: "=", gapSymbol: "=" });

      printObj.bold(true).size(1, 1);
      let grandTotal = null;
      item.attributes.order_totals.forEach((total) => {
        if (total.code === "total") {
          grandTotal = total;
          return;
        }

        printObj
          .textLine(48, {
            left: `${total.title}`,
            right: `${total.value}`,
            gapSymbol: ".",
          })
          .newline();
      });

      printObj.size(2, 2).textLine(48, {
        left: `${grandTotal.title}`,
        right: `${grandTotal.value}`,
        gapSymbol: ".",
      });

      printObj
        .size(1, 1)
        .newline()
        .newline()
        .newline()
        .align("center")
        .text("Thank you for your order!");

      printObj.newline().cut().send();

      console.log("RECEIPT PRINT: " + JSON.stringify(printObj));
    } catch (err) {
      console.log("Error: " + err.message);
    }
  };

  const findTotal = (order) => {
    const total = item.attributes.order_totals.find(
      (o) => o.title === "Order Total"
    );
    return total?.value && parseFloat(total.value);
  };

  const orderStatus = DELIVERY_STATUS[item.attributes.status_id];

  return (
    <ListItem.Swipeable
      onPress={onPress}
      className={`${backgroundColor} text-black border-b-[1px] border-gray-100`}
      rightContent={(reset) => {
        return (
          <TouchableOpacity onPress={() => { reset(); printReceipt(); }}>
          <View
            className={
              `w-full h-full flex flex-row items-center justify-center ${isConnected ? "bg-orange-500" : "bg-gray-400"}`
            }
          >
            <Icon
              name={isConnected ? "printer" : "printer-off"}
              type="material-community"
              size={32}
              color={"white"}
            />
          </View>
          </TouchableOpacity>          
        );
      }}
      leftContent={(reset) => {
        return (
          <TouchableOpacity onPress={() => {
            reset();
            if(orderStatus === 'Completed') return;
            updateStatus();
          }} disabled={!(orderStatus !== 'Completed')}>
          <View onPress={() => { console.log("fdsaadsf"); }}
          className={`w-full h-full flex flex-row items-center justify-center 
          ${orderStatus === 'Completed' ? 'bg-green-500' : 'bg-orange-500'}`}>
            { isFetching && <LinearProgress color="secondary" /> }
            { !isFetching && <Icon name={orderStatus === 'Completed' ? 'check' : 'update'} type="material-comunity"
              size={32}
              color={"white"}
            /> }
          </View>
          </TouchableOpacity>
        )
      }}
    >
      <ListItem.Content className="flex flex-row justify-between">
        <View className="flex flex-row items-center gap-2">
          <View className="bg-gray-200 rounded-full p-2">
            <Icon name="delivery-dining" type="materialicons" size={28} />
          </View>
          <View className="">
            <Text numberOfLines={1} className="w-52">
              {item.attributes.formatted_address}
            </Text>
            <View className="flex flex-row items-center">
              {/* <Icon name={orderStatus === 'Completed' ? 'check' :  "clock"} 
              type="feather" size={12} 
              color={orderStatus === 'Completed' ? 'green' : 'gray'} /> */}
              { isMissed ? ICONS['Missed'] : ICONS[orderStatus] }
              <Text className={"text-xs " + (isMissed ? "text-red-500" : "text-gray-800")}> {isMissed ? "Missed" : orderStatus} </Text>
            </View>
          </View>
        </View>

        <View className="">
          <Text> {findTotal(item)} &pound; </Text>
        </View>

        {/* <View>
        <Text>
          {item.attributes.first_name} {item.attributes.last_name}{" "}
        </Text>
      </View>
      
      <View>
        <Text className="font-bold"> Orders </Text>
      </View>
      <Button onPress={printReceipt}> Print Receipt </Button>
      {item.attributes.status_id !== 5 && (
        <Button color={"secondary"} onPress={updateStatus} loading={isFetching}>
          {DELIVERY_STATUS[item.attributes.status_id + 1]}
        </Button>
      )} */}
      </ListItem.Content>
    </ListItem.Swipeable>
  );
}