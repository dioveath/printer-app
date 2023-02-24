import { View, Text, TextInput } from "react-native";
import React, { useState, createRef, useRef } from "react";
import { Input, Button } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../Redux/auth/authApiSlice";
import { setCredentials } from "../../Redux/auth/authSlice";

export default function Auth() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading, error }] = useLoginMutation();

  const onLoginClick = async () => {
    const creds = {
      username,
      password,
      device_name: "android",
    };

  console.log(creds)    ;

    try {
      const { token } = await login(creds).unwrap();
      dispatch(setCredentials({ accessToken: token }));
    } catch (e) {
      if (e?.data) console.log(e?.data?.message);
      else console.log(e?.message);
    }
  };

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
          secureTextEntry={true}
        />
        {error && (
          <Text className="text-xs text-red-500"> {error.data.message} </Text>
        )}
        <Button onPress={onLoginClick} loading={isLoading}>
          Login
        </Button>
      </View>
    </View>
  );
}
