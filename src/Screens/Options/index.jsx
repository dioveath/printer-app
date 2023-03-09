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

import { CustomButton } from "../../Components/CustomButton";


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
    <>
      <View className="p-6 py-10 flex flex-row justify-between items-center">
        <Text className="font-nebula-bold text-2xl">Settings </Text>
        <CustomButton type='outlined' onPress={async () => {
          await removeItem();
          dispatch(logout());          
        }}> Logout </CustomButton>
      </View>    
      <View className="h-[1px] bg-orange-500"/>      
    <ScrollView className="flex-1">

      <View className="h-[1px] bg-gray-300 mt-4 mb-4"/>      
      <Text className='font-nebula-semibold px-6'>Connect thermal printer to this app. </Text>
      <Text className='font-nebula text-xs px-6 text-gray-500' numberOfLines={4}>Your orders will be printed automatically after you accept them with this app. </Text>
      <View className="flex flex-row justify-between items-center my-2 px-6">
        <Text className="font-nebula-semibold">Bluetooth </Text>
        <Switch
          disabled={scanning || isPending}
          value={enabled}
          onValueChange={(value) => toggleBluetooth(value)}
        />
      </View>      
      <Text className='font-nebula text-xs px-6 text-gray-500' numberOfLines={4}>Firstly make sure your bluetooth is turned on. </Text>      
      <View className="h-[1px] bg-gray-300 my-4"/>            
      
      <Text className='font-nebula-bold px-6'> Add a printer. </Text>
      <Text className='font-nebula text-xs px-6 text-gray-500' numberOfLines={4}> Next, lets scan for your bluetooth printer. </Text>      

      <View className="my-4 px-6">
        <Button
          color={'#F97316'}
          size="sm"
          titleStyle={{ fontFamily: 'BRNebula-SemiBold'}}
          radius={100}
          onPress={scanDevices}
          disabled={!enabled}
          loading={scanning}          
        >
          Scan for printers
        </Button>
        <View className='h-2'/>
        <Button
         color={'#3B82F6'}
         titleStyle={{ fontFamily: 'BRNebula-SemiBold'}}         
         size="sm"
         radius={100}
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

      <Text className='font-nebula-semibold px-6'>Found/Scanned Printer </Text>
      <Text className='font-nebula text-xs px-6 my-2 text-gray-500' numberOfLines={4}>You'll see list of printers that are discoverd and/or paired. </Text>      
        { found && found.length === 0 && (
            <Text className='font-nebula text-xs px-6 py-4 text-gray-500' numberOfLines={4}>No printer found. </Text>
        )}

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
                  dispatch(setPrinter(d));
                } catch (e) {
                  console.log("Error: " + e.message);
                  dispatch(setPrinterError({ error: e.message }));
                }
              }}
            >
              <ListItem.Title style={{fontFamily: 'BRNebula-SemiBold'}}> {d.name} </ListItem.Title>
              <ListItem.Subtitle style={{fontFamily: 'BRNebula-Regular'}}> {d.bt} </ListItem.Subtitle>
            </ListItem>
          );
        })}
      {/* </ListItem.Accordion> */}

      <View className="h-[1px] bg-gray-300 my-4"/>

      <Text className='font-nebula-semibold px-6'>Connected Printer </Text>
      <Text className='font-nebula text-xs px-6 text-gray-500' numberOfLines={4}>Your connected printer and its status. You can only print when there is green symbol. It might take some seconds to configure everything. </Text>
      { connectedPrinter && (
        <>
        <View className="my-2 px-6">
          <View className='flex flex-row gap-2 items-center'>
          <Text className="font-nebula text-xs text-gray-700"> {connectedPrinter.name} </Text>
          <View className={`h-2 w-2 rounded-full ${canPrint ? 'bg-green-500' : 'border-[1px] border-green-500'}`}/>                    
          </View>
          
          <Text className="font-nebula text-xs text-gray-700"> {connectedPrinter.bt} </Text>
        </View>

        <View className='flex flex-row pb-4'>
        <View className="px-6">
          <Text className="font-nebula-semibold"> Connection </Text>
          <Text className="font-nebula text-xs text-gray-700"> {status?.connection} </Text>
        </View>
        <View className="px-6">
          <Text className="font-nebula-semibold"> State </Text>
          <Text className="font-nebula text-xs text-gray-700"> {status?.online} </Text>
        </View>        
        <View className="px-6">
          <Text className="font-nebula-semibold"> Paper </Text>
          <Text className="font-nebula text-xs text-gray-700"> {status?.paper} </Text>
        </View>                
        </View>

        </>        
      )}

      <View className="h-10"/>
      <ListItem topDivider bottomDivider onPress={() => navigation.navigate('AddPrinter') }>
        <ListItem.Title style={{fontFamily: 'BRNebula-SemiBold'}}> Supported Printers </ListItem.Title>
      </ListItem>
      <View className="h-40"/>

    </ScrollView>
    </>
  );
}
