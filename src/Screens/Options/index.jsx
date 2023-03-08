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
import { setPrinter, setPrinterError, setPrinterPending, setPrinterStatus } from "../../Redux/connectivity/printerSlice";
import { bleManager } from '../../lib/bleManager';



export default function OptionScreen({ navigation }) {
  const dispatch = useDispatch();
  const { isEnabled: enabled, isPending } = useSelector((state) => state.bluetooth);
  const { device: connectedPrinter, status } = useSelector((state) => state.printer);
  const printer = useSelector((state) => state.printer);
  const { removeItem } = useAsyncStorage("credentials");
  const { setItem: savePrinter } = useAsyncStorage("printer");
  const [found, setFound] = useState([]);
  const [scanning, setScanning] = useState(false);
  
  const canPrint = enabled && connectedPrinter && status?.connection === "CONNECT";
  
  const toggleBluetooth = async (value) => {
    try {
      dispatch(setBTPending());
      if (value) await bleManager.enable("transactionId");
      else await bleManager.disable("transactionId");
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

  return (
    <ScrollView className="flex-1">
      <View className="p-6 py-10">
        <Text className="text-2xl font-bold"> Settings </Text>
      </View>
      


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
          disabled={!enabled}
          loading={scanning}          
        >
          Scan Devices
        </Button>
        <Button
          disabled={!canPrint}
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
        <>
        <View className="my-2 px-4">
          <Text className="text-lg font-bold"> Connected Printer </Text>
          <Text className="text-gray-700"> {connectedPrinter.name} 
            <View className={`ml-2 h-3 w-3 rounded-full ${canPrint ? 'bg-green-500' : 'border-[1px] border-green-500'}`}/>
          </Text>
          <Text className="text-gray-700"> {connectedPrinter.bt} </Text>
        </View>

        <View className='flex flex-row pb-4'>
        <View className="px-4">
          <Text className="text-lg font-bold"> Connection </Text>
          <Text className="text-gray-700"> {status?.connection} </Text>
        </View>
        <View className="px-4">
          <Text className="text-lg font-bold"> State </Text>
          <Text className="text-gray-700"> {status?.online} </Text>
        </View>        
        <View className="px-4">
          <Text className="text-lg font-bold"> Paper </Text>
          <Text className="text-gray-700"> {status?.paper} </Text>
        </View>                
        </View>

        </>        
      )}


      <ListItem.Accordion
        isExpanded={!scanning}
        content={
          <>
            <Icon type="antdesign" name="printer" size={30} />
            <ListItem.Content>
              <ListItem.Title> Scanned/Paired Printers </ListItem.Title>
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
                  console.log("Selecting: " + d.bt);
                  dispatch(setPrinterPending());
                  await savePrinter(JSON.stringify(d));                  
                  dispatch(setPrinter({ device: d }));
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
          dispatch(logout());
        }}> Logout </Button>

    </ScrollView>
  );
}
