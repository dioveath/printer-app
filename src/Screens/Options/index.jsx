import { useState } from 'react';
import { View, Text, ScrollView } from "react-native";
import { ListItem, Icon, Button } from "@rneui/themed";
import { Avatar } from '@rneui/base';
// import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';

export default function OptionScreen() {
  const [expanded, setExpanded] = useState(false);


  return (
    <ScrollView className="flex-1">
      <Text className="text-2xl font-bold my-2"> Your Printers </Text>
      <ListItem.Accordion
      isExpanded={expanded}
      onPress={() => setExpanded(!expanded)}
        content={
          <>
            <Icon type="antdesign" name="printer" size={30} />
            <ListItem.Content>
              <ListItem.Title> Conneceted Printers </ListItem.Title>
            </ListItem.Content>
          </>
        }
      >
        <ListItem bottomDivider>
          <Avatar title='Name'/>
          <ListItem.Content>
            <ListItem.Title> Saroj </ListItem.Title>
            <ListItem.Subtitle> Software Engineer @ Google </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron/>
        </ListItem>
      </ListItem.Accordion>
    </ScrollView>
  );
}
