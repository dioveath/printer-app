import { View, Text } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import Dashboard from "./Dashboard";
import Auth from './Auth';

export default function MainApp() {
  const { accessToken: isLoggedIn } = useSelector((state) => state.auth);

  return (
    <>
        { isLoggedIn ? <Dashboard/> : <Auth/>}
    </>
  );
}
