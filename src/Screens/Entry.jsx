import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import MainApp from "./MainApp";
import Setup from "./Setup";
import { useSelector, useDispatch } from "react-redux";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { initDomain } from "../Redux/setup/setupSlice";
import { CustomProgressIndicator } from "../Components/CustomProgressIndicator";

export default function Entry() {
  const dispatch = useDispatch();
  const domain = useSelector((state) => state.setup);
  const { getItem } = useAsyncStorage("setup");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getItem()
      .then((setup) => {
        if (setup) dispatch(initDomain(JSON.parse(setup)));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <View className='flex-1 justify-center'>
        <CustomProgressIndicator />
        <Text className='text-center font-nebula'> Intializing... </Text>        
      </View>
    );
    
  return <>{domain?.domain ? <MainApp /> : <Setup />}</>;
}
