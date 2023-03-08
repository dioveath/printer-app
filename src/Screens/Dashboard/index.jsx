import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "@rneui/base";

import { bleManager } from "../../lib/bleManager";
import EscPosPrinter, {
  getPrinterSeriesByName,
} from "react-native-esc-pos-printer";
import { useDispatch, useSelector } from "react-redux";
import { setBTStatus } from "../../Redux/connectivity/bluetoothSlice";
import { setPrinterStatus, setPrinter } from "../../Redux/connectivity/printerSlice";

import HomeScreen from "../Home";
import OrderPage from "../Home/OrderPage";
import OptionScreen from "../Options";
import AddPrinter from "../Options/AddPrinter";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardNavigator} />
      <Stack.Screen name="AddPrinter" component={AddPrinter} />
      <Stack.Screen name="OrderPage" component={OrderPage} />
    </Stack.Navigator>
  );
};

const DashboardNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Icon name="home" />,
        }}
      />
      <Tab.Screen
        name="Options"
        component={OptionScreen}
        options={{
          title: "Options",
          tabBarIcon: ({ color, size }) => <Icon name="settings" />,
        }}
      />
    </Tab.Navigator>
  );
};

export default function Dashboard() {
  const { device } = useSelector((state) => state.printer);
  const dispatch = useDispatch();
  const { getItem } = useAsyncStorage("printer");

  // poll for current bluetooth status
  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      if (state === "PoweredOn") {
        dispatch(setBTStatus({ isEnabled: true }));
      } else {
        dispatch(setBTStatus({ isEnabled: false }));
      }
    }, true);
    return () => subscription.remove();
  }, []);


  useEffect(() => {
    if (!device) return;

    EscPosPrinter.init({
      target: device.target,
      seriesName: getPrinterSeriesByName(device.name),
      language: "EPOS2_LANG_EN",
    })
      .then((status) => {
        console.log("Init success:" + status);
      })
      .catch((e) => {
        console.log("Init failed: " + e.message);
        dispatch(setPrinterError({ error: e.message }));
      });

    const listener = (status) => {
      console.info(status.connection, status.online, status.paper);
      if(status) dispatch(setPrinterStatus(status));
    };
    const removeListener = EscPosPrinter.addPrinterStatusListener(listener);

    try {
      EscPosPrinter.startMonitorPrinter(30)
        .then(() => console.log("Started monitoring printer status"))
        .catch((e) => {
          console.log("Error: Couldn't start monitoring", e);
        });
    } catch (e) {
      console.log("Error: Something wrong!", e);
    }
    
    return () => {
      console.log("Unmounting");
      dispatch(setPrinterStatus());
      removeListener();
      EscPosPrinter.stopMonitorPrinter()
        .then(() => console.log("Stopped monitoring printer status!"))
        .catch((e) => console.log("Error: Can't stop moniter", e));
    };
  }, [device]);

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
