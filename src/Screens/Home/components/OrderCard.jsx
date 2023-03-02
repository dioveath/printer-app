import { View, Text } from "react-native";
import React from "react";
import { Icon, Button } from "@rneui/themed";
import { TouchableOpacity } from "react-native";
import { useUpdateOrderMutation } from "../../../Redux/orders/ordersApiSlice";
import EscPosPrinter, {
  getPrinterSeriesByName,
} from "react-native-esc-pos-printer";

const DELIVERY_STATUS = [
  "Empty",
  "Received",
  "Pending",
  "Preparation",
  "Delivery",
  "Completed",
];

export default function OrderCard({
  item,
  onPress,
  backgroundColor,
  textColor,
}) {
  const [updateOrder, { isFetching }] = useUpdateOrderMutation();

  const updateStatus = () => {
    console.log("Updating order status...");
    updateOrder({ id: item.id, status_id: item.attributes.status_id + 1 });
  };

  const printReceipt = () => {
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

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${backgroundColor} ${textColor} p-2 m-2 rounded-md`}
    >
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center">
          <Icon name="place" />
          <Text numberOfLines={1} className="w-32">
            {item.attributes.formatted_address}
          </Text>
        </View>
        <View className="flex flex-row items-center">
          <Text className="bg-emerald-500 text-white px-4 py-2 rounded-md">
            {item.attributes.status.status_name}
          </Text>
          <Icon type="entypo" name="dots-three-vertical" />
        </View>
      </View>
      <View>
        <Text>
          {item.attributes.first_name} {item.attributes.last_name}{" "}
        </Text>
      </View>
      <View className="h-[1px] bg-gray-400/50 rounded-md" />
      <View>
        <Text className="font-bold"> Orders </Text>
      </View>
      <Button onPress={printReceipt}> Print Receipt </Button>
      {item.attributes.status_id !== 5 && (
        <Button color={"secondary"} onPress={updateStatus} loading={isFetching}>
          {DELIVERY_STATUS[item.attributes.status_id + 1]}
        </Button>
      )}
    </TouchableOpacity>
  );
}
