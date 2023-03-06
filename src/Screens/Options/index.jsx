import { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { ListItem, Icon, Switch, Button } from "@rneui/themed";

import EscPosPrinter, {
  getPrinterSeriesByName,
} from "react-native-esc-pos-printer";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/auth/authSlice";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { setBTError, setBTStatus, setBTPending } from "../../Redux/connectivity/bluetoothSlice";
import { setPrinter, setPrinterError, setPrinterPending } from "../../Redux/connectivity/printerSlice";
import { bleManager } from '../../lib/bleManager';

export default function OptionScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isEnabled: enabled, isPending } = useSelector((state) => state.bluetooth);
  const connectedPrinter = useSelector((state) => state.printer.device);
  const { removeItem } = useAsyncStorage("credentials");
  const [found, setFound] = useState([]);
  const [scanning, setScanning] = useState(false);
  
  const toggleBluetooth = async (value) => {
    try {
      dispatch(setBTPending());
      if (value) await bleManager.enable("transactionId");
      else await bleManager.disable("transactionId");      
      dispatch(setBTStatus({ isEnabled: value }));
    } catch (err) {
      console.log("Error: " + JSON.stringify(err));
      dispatch(setBTError({ error: err }));
    }
  };

  
  const scanDevices = async () => {
    try {
      setScanning(true);      
      const printers = await EscPosPrinter.discover();
      setFound(printers);
      console.log(printers);
    } catch (err) {
      console.log("Error: " + JSON.stringify(err));
    } finally { setScanning(false); }
  };


  useEffect(() => {
    try { 
      EscPosPrinter.startMonitorPrinter(30)
        .then(() => console.log("Started monitoring printer status"))
        .catch((e) => { console.log("Error: Couldn't start monitoring", e) });
    } catch(e){
      console.log("Error: Something wrong!", e);
    }
    
    return () => {
      console.log("Unmounting");
      EscPosPrinter.stopMonitorPrinter()
        .then(() => console.log("Stopped monitoring printer status!"))
        .catch(e => console.log("Error: Can't stop moniter", e));
    };
  }, [!!connectedPrinter]);

  return (
    <ScrollView className="flex-1">
      <Text className="text-2xl font-bold p-6"> Your Printers </Text>

      <View className="flex flex-row justify-between items-center my-4 px-6">
        <Text className="text-lg"> Bluetooth </Text>
        <Switch
          disabled={scanning || isPending}
          value={enabled}
          onValueChange={(value) => toggleBluetooth(value)}
        />
      </View>      
      
      <View className="h-[1px] bg-gray-300"/>

      <View className="my-4 px-4">
        <Button
          className="py-2 rounded-md"
          onPress={scanDevices}
          // disabled={!!connectedPrinter}
          loading={scanning}          
        >
          Scan Devices
        </Button>
        <Button
          disabled={!connectedPrinter}
          onPress={async () => {
            try {
              const printing = new EscPosPrinter.printing();
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
                .newline()
                .cut()
                .send();
              console.log("SUCCESS: " + status);
            } catch (e) {
              console.log("Error: " + e.message);
            }
          }}
        >
          Print Test Label
        </Button>
      </View>

      <View className="h-[1px] bg-gray-300 mb-4"/>

      { connectedPrinter && (
        <View className="my-4 px-4">
          <Text className="text-lg font-bold"> Connected Printer </Text>
          <Text className="text-gray-700"> {connectedPrinter.name} </Text>
          <Text className="text-gray-700"> {connectedPrinter.bt} </Text>
        </View>
      )}


      <ListItem.Accordion
        isExpanded={!scanning}
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
          if(connectedPrinter && connectedPrinter.bt === d.bt) return;
          return (
            <ListItem
              bottomDivider
              key={d.bt}
              onPress={async () => {
                try {
                  console.log("Connecting to: " + d.bt);
                  dispatch(setPrinterPending());
                  EscPosPrinter.init({ 
                    target: d.target,
                    seriesName: getPrinterSeriesByName(d.name),
                    language: "EPOS2_LANG_EN"
                  }).then((status) => {
                    console.log(status);
                    dispatch(setPrinter({ device: d }));
                  }).catch((e) => {
                    console.log("Init failed: " + e.message);
                    dispatch(setPrinterError({ error: e.message }));
                  });
                } catch (e) {
                  console.log("Error: " + e.message);                  
                  dispatch(setPrinterError({ error: e.message }));
                }
              }}
            >
              <ListItem.Title> {d.name} </ListItem.Title>
              <ListItem.Subtitle> {d.bt} </ListItem.Subtitle>
            </ListItem>
          );
        })}
      </ListItem.Accordion>

      <ListItem topDivider bottomDivider onPress={() => navigation.navigate('AddPrinter') }>
        <ListItem.Title> Supported Printers </ListItem.Title>
      </ListItem>

        <Button className="w-full flex-1 mx-4 my-2" color={'error'} onPress={async () => {
          console.log('Logout');
          await removeItem();
          // dispatch()
          dispatch(logout());
        }}> Logout </Button>

    </ScrollView>
  );
}
