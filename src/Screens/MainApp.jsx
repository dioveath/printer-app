import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Dashboard from "./Dashboard";
import Auth from './Auth';

import { useAsyncStorage } from "@react-native-async-storage/async-storage";

export default function MainApp() {
  const { accessToken: isLoggedIn } = useSelector((state) => state.auth);

  
  const { getItem } = useAsyncStorage("printer");

  useEffect(() => {
    // get the device item if it is stored in async storage
    getItem().then((device) => {
      if (device) {
        // set the device in the redux store (current state for us)
        dispatch(setPrinter(device));
      }
    });
  }, []);



  return (
    <>
        { isLoggedIn ? <Dashboard/> : <Auth/>}
    </>
  );
}
