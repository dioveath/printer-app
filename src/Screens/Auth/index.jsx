import { View, Text, TextInput } from "react-native";
import React, { useState, useEffect, createRef, useRef } from "react";
import { Input, Button, Icon } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../Redux/auth/authApiSlice";
import { setCredentials } from "../../Redux/auth/authSlice";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";


export default function Auth() {
  const { getItem, setItem } = useAsyncStorage("credentials");
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
      setItem(token).then(() => dispatch(setCredentials({ accessToken: token })));
    } catch (e) {
      if (e?.data) console.log(e?.data?.message);
      else console.log(e?.message);
    }
  };

  useEffect(() => {
    getItem().then((token) => {
      if (token) dispatch(setCredentials({ accessToken: token }));
    });
  }, [])
    
  return (
    <View className="flex-1 justify-center items-center">
      <View className="w-full px-10">
        <Input
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          rightIcon={<Icon onPress={() => setShowPassword(!showPassword) } type='entypo' name={showPassword ? 'eye-with-line' : 'eye'}/>}
        >
          </Input>
        {error && (
          <Text className="text-xs text-red-500"> {error.data.message} </Text>
        )}
        <Button onPress={onLoginClick} loading={isLoading}>
          Login
        </Button>

         <Text> Reset your setup? </Text>
      </View>
    </View>
  );
}
