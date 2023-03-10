import EscPosPrinter from "react-native-esc-pos-printer";

const printReceipt = (item, logoUri) => {
    console.log("Printing receipt...");
    // check if there is a active connection to printer
    // if not, navigate to options screen
    try {
      const printing = new EscPosPrinter.printing();
      const printObj = printing
        .initialize()
        .align("center")
        .image(
          { uri: logoUri },
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

  export { printReceipt };