import { View, Text } from "react-native";
import React, { useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Input, Button, Icon } from "@rneui/themed";
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
    <View className="flex-1 justify-around items-center">

      <View className='w-full px-6 gap-4'>
        <Text className='text-lg font-nebula-bold'>Lets get you up and running </Text>
        <Text className='text-sm font-nebula'>We need to know some initial information about your website. To get you started please fill in the information below. </Text>
      </View>
      
      
      
      <View className='w-full px-6'>
        <Text className="font-nebula text-left mt-2">Enter your website address below: </Text>
        <Input inputStyle={{ fontSize: 14, fontFamily: 'BRNebula-Regular' }} placeholder="e.g. https://www.yourwebsite.co.uk" value={domain} onChangeText={(val) => { setError(null); setDomain(val); }} />
        {error && <Text className="text-red-500 text-xs text-center">{error}</Text> }
        <Button color={'#F97316'} onPress={onSetup} loading={loading} radius={100}>

        <View className='flex flex-row items-center justify-center gap-2'>
          <Text className='font-nebula-bold text-white'>Next step</Text>
          <Icon type='material-community' name='location-exit' color={'white'} size={20}/>
        </View>          
  
        </Button>

        {/* <View className='flex flex-row py-2'>
            <Text>Register with us directly from </Text>
            <Text onPress={() => {
                Linking.openURL('https://tastyigniter.com/marketplace');
            }} className='text-orange-500'>Igniter Marketplace </Text>
        </View> */}
      </View>

      <Text className='font-nebula leading-5 px-6'>By clicking 'Next step', you agree to our <Text className='text-orange-500' onPress={() => {}}>Terms of Services</Text>, 
          <Text className='text-orange-500' onPress={() => {}}> Community guidelines </Text>and have read <Text className='text-orange-500' onPress={() => {}}> Privacy Policy</Text>.
        </Text>      
    </View>
  );
}
