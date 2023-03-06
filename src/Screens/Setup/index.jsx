import { View, Text } from "react-native";
import React, { useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Input, Button } from "@rneui/themed";
import { Linking } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { initDomain } from "../../Redux/setup/setupSlice";
import * as yup from "yup";
import axios from 'axios';


const domainYup = yup.object().shape({
    domain: yup.string().matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter valid domain!'
    ).required("Domain is required"),
});


export default function Setup() {
    const dispatch = useDispatch();
    const setup = useSelector(state => state.setup);
    const [domain, setDomain] = useState(setup.domain);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { setItem } = useAsyncStorage("setup");

    const onSetup = async () => {
        setLoading(true);
        try { 
            const data = { domain };
            await domainYup.validate(data);
            const options = {
                method: 'POST',
                url: 'https://ti-ext-appcompanion-server.vercel.app/api/v1/app/check',
                headers: { 'Content-Type': 'application/json' },
                data: data
            };

            const response = await axios.request(options);

            const appDomain = response.data.app;
            await setItem(JSON.stringify(appDomain));
            dispatch(initDomain(appDomain));
        } catch (err) {
            if(err?.response) setError(err.response.data.message);
            else setError(err.message);
        } finally {
            setLoading(false);
        }
    };

  return (
    <View className="flex-1 justify-center items-center">
      <View className='w-full px-10'>
        <Text className="text-2xl font-bold text-center my-4"> Enter your domain </Text>
        <Input placeholder="Domain" value={domain} onChangeText={(val) => { setError(null); setDomain(val); }} />
        {error && <Text className="text-red-500 text-xs text-center">{error}</Text> }
        <Button onPress={onSetup} loading={loading}>
          Setup
        </Button>

        <View className='flex flex-row py-2'>
            <Text> Register with us directly from </Text>
            <Text onPress={() => {
                Linking.openURL('https://tastyigniter.com/marketplace');
            }} className='text-blue-500'>Igniter Marketplace </Text>
        </View>

      </View>
    </View>
  );
}
