import { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { ListItem, Icon, Switch, Button } from "@rneui/themed";
import { Avatar } from "@rneui/base";
import {
  BluetoothManager,
  BluetoothTscPrinter,
} from "react-native-bluetooth-escpos-printer";
import EscPosPrinter, {
  getPrinterSeriesByName,
} from "react-native-esc-pos-printer";
import { uniqByKeepFirst } from "../../Helpers/misc";

export default function OptionScreen() {
  const [expanded, setExpanded] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [found, setFound] = useState([]);
  const [connected, setConnected] = useState([]);

  const toggleBluetooth = async (value) => {
    try {
      if (value) await BluetoothManager.enableBluetooth();
      else await BluetoothManager.disableBluetooth();
    } catch (err) {
      console.log("Error: " + JSON.stringify(err));
    } finally {
      await pollAndSetBluetooth();
    }
  };

  const pollAndSetBluetooth = async () => {
    try {
      const check = await BluetoothManager.isBluetoothEnabled();
      setEnabled(check);
    } catch (err) {
      console.log("Error: " + JSON.stringify(err));
    }
  };

  const scanDevices = async () => {
    try {
      const printers = await EscPosPrinter.discover();
      setFound(printers);
      console.log(printers);
    } catch (err) {
      console.log("Error: " + JSON.stringify(err));
    }
  };

  useEffect(() => {
    (async () => {
      await pollAndSetBluetooth();
    })();
  }, []);

  useEffect(() => {
    const listener = (status) => {
      if (status.connection !== "CONNECT") setConnected([]);
      console.info(status.connection, status.online, status.paper);
    };
    EscPosPrinter.addPrinterStatusListener(listener);
    EscPosPrinter.startMonitorPrinter(30)
      .then(() => console.log("Started monitoring printer status"))
      .catch((e) => console.log(e));
    return () => {
      EscPosPrinter.stopMonitorPrinter();
    };
  }, []);

  return (
    <ScrollView className="flex-1">
      <Text className="text-2xl font-bold my-2"> Your Printers </Text>

      <View className="flex flex-row justify-between items-center my-4 px-4">
        <Text className="text-lg"> Bluetooth </Text>
        <Switch
          value={enabled}
          onValueChange={(value) => toggleBluetooth(value)}
        />
      </View>

      <View className="my-4 px-4">
        <Button
          className="py-2 rounded-md"
          onPress={scanDevices}
          disabled={!enabled}
        >
          Scan Devices
        </Button>
        <Button
          onPress={async () => {
            try {
              const printing = new EscPosPrinter.printing();
              console.log(printing);
              const status = await printing
                .initialize()
                .align("center")
                .size(1, 1)
                .line("CONNECTION TEST")
                .newline()
                .textLine(48, {
                  left: "CONNECTION",
                  right: "OK",
                  gapSymbol: "-",
                })
                .cut()
                .send();
              console.log(status);
            } catch (e) {
              console.log("Error: " + e.message);
            }
          }}
        >
          Print Test Label
        </Button>
      </View>

      <ListItem.Accordion
        isExpanded={!enabled ? false : expanded}
        content={
          <>
            <Icon type="antdesign" name="printer" size={30} />
            <ListItem.Content>
              <ListItem.Title> Scanned Printers </ListItem.Title>
            </ListItem.Content>
          </>
        }
      >
        {found.map((d) => {
          return (
            <ListItem
              bottomDivider
              key={d.bt}
              onPress={async () => {
                console.log(d);
                try {
                  console.log("Connecting to: " + d.bt);
                  await EscPosPrinter.init({
                    target: d.target,
                    seriesName: getPrinterSeriesByName(d.name),
                    language: "EPOS2_LANG_EN",
                  });
                  setConnected([d]);
                  console.log("Connected to: " + d.bt);
                } catch (e) {
                  console.log("Error: " + e.message);
                }
              }}
            >
              <ListItem.Title> {d.name} </ListItem.Title>
              <ListItem.Subtitle> {d.bt} </ListItem.Subtitle>
            </ListItem>
          );
        })}
      </ListItem.Accordion>
      <ListItem.Accordion
        isExpanded={!enabled ? false : expanded}
        onPress={() => setExpanded(!expanded)}
        content={
          <>
            <Icon type="antdesign" name="printer" size={30} />
            <ListItem.Content>
              <ListItem.Title> Active Printer </ListItem.Title>
            </ListItem.Content>
          </>
        }
      >
        {connected.map((d) => {
          return (
            <ListItem bottomDivider key={d.bt}>
              <ListItem.Content>
                <ListItem.Title> {d.name} </ListItem.Title>
                <ListItem.Subtitle> {d.bt} </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          );
        })}
      </ListItem.Accordion>
    </ScrollView>
  );
}
