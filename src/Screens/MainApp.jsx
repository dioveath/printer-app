import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

import Dashboard from "./Dashboard";
import Auth from './Auth';
import { setPrinter } from "../Redux/connectivity/printerSlice";
import { CustomProgressIndicator } from "../Components/CustomProgressIndicator";

export default function MainApp() {
  const dispatch = useDispatch();
  const { accessToken: isLoggedIn } = useSelector((state) => state.auth);
  const { getItem } = useAsyncStorage("printer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getItem().then((device) => {
      if (device) {
        // set the device in the redux store (current state for us)
        console.log('Found device in async storage: ', device);
        dispatch(setPrinter(JSON.parse(device)));
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading)
  return (
    <View className='flex-1 justify-center'>
      <CustomProgressIndicator />
      <Text className='text-center font-nebula'> Loading credentials... </Text>
    </View>
  );

  return (
    <>
        { isLoggedIn ? <Dashboard/> : <Auth/>}
    </>
  );
}
