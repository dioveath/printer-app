import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

import Dashboard from "./Dashboard";
import Auth from './Auth';
import { setPrinter } from "../Redux/connectivity/printerSlice";

export default function MainApp() {
  const dispatch = useDispatch();
  const { accessToken: isLoggedIn } = useSelector((state) => state.auth);
  const { getItem } = useAsyncStorage("printer");

  useEffect(() => {
    getItem().then((device) => {
      if (device) {
        // set the device in the redux store (current state for us)
        console.log('Found device in async storage: ', device);
        dispatch(setPrinter(JSON.parse(device)));
      }
    });
  }, []);



  return (
    <>
        { isLoggedIn ? <Dashboard/> : <Auth/>}
    </>
  );
}
