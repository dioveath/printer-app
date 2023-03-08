import { View, Text, TextInput } from "react-native";
import React, { useState, useEffect, createRef, useRef } from "react";
import { Input, Button, Icon } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../Redux/auth/authApiSlice";
import { setCredentials } from "../../Redux/auth/authSlice";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { clear } from "../../Redux/setup/setupSlice";

export default function Auth() {
  const { getItem, setItem } = useAsyncStorage("credentials");
  const { removeItem: removeSetup } = useAsyncStorage("setup");
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading, error }] = useLoginMutation();

  const onLoginClick = async () => {
    const creds = {
      username,
      password,
      device_name: "android",
    };

    try {
      const { token } = await login(creds).unwrap();
      setItem(token).then(() =>
        dispatch(setCredentials({ accessToken: token }))
      );
    } catch (e) {
      if (e?.data) console.log(e?.data?.message);
      else console.log(e?.message);
    }
  };

  useEffect(() => {
    getItem().then((token) => {
      if (token) dispatch(setCredentials({ accessToken: token }));
    });
  }, []);

  return (
    <View className="flex-1 justify-around">

      <View>
        <Text className="text-left text-2xl font-bold px-6">Login</Text>
        <Text className='px-6'>Enter your login details to start accepting orders. </Text>
      </View>
      

      <View className="w-full px-6">
        <Text className=''> Enter your credentials </Text>
        <Input
        inputStyle={{fontSize: 16}}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <Input
        inputStyle={{fontSize: 16}}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          rightIcon={
            <Icon
              onPress={() => setShowPassword(!showPassword)}
              type="entypo"
              name={showPassword ? "eye-with-line" : "eye"}
            />
          }
        ></Input>
        {error && (
          <Text className="text-xs text-red-500"> {error.data.message} </Text>
        )}
        <Button onPress={onLoginClick} loading={isLoading} radius={100} color={'#F97316'}>
          <View className='flex flex-row items-center justify-center gap-2'>
            <Text className='font-bold text-white'>Login</Text>
            <Icon type='material-community' name='location-exit' color={'white'} size={20}/>
          </View>        
        </Button>

        <View className='flex flex-row mt-10'>
          <Text>Recofigure your setup? </Text>
          <Text className='text-orange-500' onPress={async () => {
            await removeSetup();
            dispatch(clear());
          }}> Reset </Text>
        </View>
      </View>

      <View></View>
    </View>
  );
}
