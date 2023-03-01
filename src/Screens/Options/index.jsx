import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  DeviceEventEmitter,
} from "react-native";
import { ListItem, Icon, Switch, Button } from "@rneui/themed";
import { Avatar } from "@rneui/base";
import {
  BluetoothManager,
  BluetoothTscPrinter,
} from "react-native-bluetooth-escpos-printer";
import { uniqByKeepLast } from "../../Helpers/misc";

export default function OptionScreen() {
  const [expanded, setExpanded] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [paired, setPaired] = useState([]);

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

  const scanDevices = () =>
    BluetoothManager.scanDevices().then(
      (s) => {
        const ss = JSON.parse(s);
        console.log(ss);
        // setDevices({ paired, found });
      },
      (er) => {
        console.log("Error: " + JSON.stringify(er));
      }
    );

  const deviceAlreadyPaired = (rsp) => {
    if (!rsp) return;

    let ds = null;
    if (typeof rsp === "object") {
      ds = rsp.devices;
    } else {
      try {
        ds = JSON.parse(`${rsp.devices}`);
      } catch (err) {
        console.log("Error: " + err.message);
      }
    }

    if (!ds) return;
    let newPaired = [...ds, ...paired];

    newPaired = uniqByKeepLast(newPaired, (it) => it.address);

    console.log(newPaired);
    setPaired(newPaired);
  };

  const deviceFound = (rsp) => {
    var foundDevice = null;
    if (typeof rsp.device === "object") {
      foundDevice = rsp.device;
    } else {
      try {
        foundDevice = JSON.parse(rsp.device);
      } catch (e) {
        console.log("Error: " + e.message);
      }
    }

    console.log("FOUND DEVICE");
    console.log(foundDevice);
  };

  const listeners = [];
  if (Platform.OS === "android") {
    listeners.push(
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        deviceAlreadyPaired
      )
    );
    listeners.push(
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        deviceFound
      )
    );
    listeners.push(
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        () => {
          console.log("connection lost!");
        }
      )
    );
  }

  useEffect(() => {
    (async () => {
      await pollAndSetBluetooth();
    })();
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
              await BluetoothTscPrinter.printLabel({
                width: 40,
                height: 30,
                text: [
                  {
                    text: "This is test",
                    x: 20,
                    y: 50,
                    rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
                    xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
                    yscal: BluetoothTscPrinter.FONTMUL.MUL_1,
                  },
                ],
              });
            } catch (err) {
              console.log("Error: " + JSON.stringify(err));
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
              <ListItem.Title> Paired Devices </ListItem.Title>
            </ListItem.Content>
          </>
        }
      >
        {paired.map((d, idx) => {
          return (
            <ListItem bottomDivider key={idx}>
              <ListItem.Title> {d.name} </ListItem.Title>
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
              <ListItem.Title> Conneceted Printers </ListItem.Title>
            </ListItem.Content>
          </>
        }
      >
        <ListItem bottomDivider>
          <Avatar title="Name" />
          <ListItem.Content>
            <ListItem.Title> Saroj </ListItem.Title>
            <ListItem.Subtitle> Software Engineer @ Google </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </ListItem.Accordion>
    </ScrollView>
  );
}
