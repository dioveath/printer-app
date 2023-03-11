import EscPosPrinter from "react-native-esc-pos-printer";

const printReceipt = (item, logoUri) => {
    console.log("Printing receipt...");
    // check if there is a active connection to printer
    // if not, navigate to options screen
    try {
      const printing = new EscPosPrinter.printing();
      const printObj = printing
        .initialize()
        // .align("center")
        // .image(
        //   { uri: logoUri },
        //   { width: 400 }
        // )
        .newline()
        .newline()
        .newline()
        .size(2, 2)
        .align("center")
        .bold(true)
        .text(`# ${item.id}`).newline()
        .bold(false)

        .size(1, 1)
        .bold(true)
        .text(`${new Date(
          item.attributes.invoice_date
        ).toLocaleString()}`).newline()
        
        .size(2, 2)
        .bold(false)
        .text(`${item.attributes.first_name} ${item.attributes.last_name}`).newline()
        .text(`${item.attributes.payment}`).newline().newline()

        .size(2, 2).bold(false)
        .text(`${item.attributes.formatted_address}`).newline().newline()
        .size(2, 2).bold(true)
        .text(`${item.attributes.telephone}`).newline()

        .textLine(48, { left: "=", right: "=", gapSymbol: "=" })
        .newline();

      
      item.attributes.order_menus.forEach((menu) => {
        printObj.bold(true).size(2, 2);
        printObj.textLine(48, {
          left: `${menu.quantity}x ${menu.name}`,
          right: `£${parseFloat(menu.price).toFixed(2)}`,
          gapSymbol: ".",
        });

        printObj.newline().newline();
        menu.menu_options.forEach((options) => {
          printObj.bold(true).size(1, 1);
          printObj.textLine(48, {
            left: `+ ${options.quantity}x ${options.order_option_name}`,
            right: `£${parseFloat(options.order_option_price).toFixed(2)}`,
            gapSymbol: ".",
          }).newline();
        });

        printObj.newline().align('left')
          .text(`Notes: ${menu.comment}`).newline()

        printObj.newline();
      });

      printObj.size(2, 2).bold(true);
      printObj.textLine(48, { left: "=", right: "=", gapSymbol: "=" }).newline();

      printObj.align('left').text(`Notes: ${item.attributes.comment}`).newline().newline();


      printObj.size(2, 2).bold(false);
      let grandTotal = null;
      item.attributes.order_totals.forEach((total) => {
        if (total.code === "total") {
          grandTotal = total;
          return;
        }

        printObj
          .textLine(48, {
            left: `${total.title}`,
            right: `£${parseFloat(total.value).toFixed(2)}`,
            gapSymbol: ".",
          })
          .newline();
      });

      
      printObj.size(2, 2).bold(true).textLine(48, {
        left: `${grandTotal.title}`,
        right: `£${parseFloat(grandTotal.value).toFixed(2)}`,
        gapSymbol: ".",
      });

      printObj
        .size(1, 1)
        .newline()
        .newline()
        .newline()
        .align("center")
        .bold(true)
        .text("Thank you for your order!");

      printObj.newline().cut().send();

      console.log("RECEIPT PRINT: " + JSON.stringify(printObj));
    } catch (err) {
      console.log("Error: " + err.message);
    }
  };

  export { printReceipt };