import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/base';
import HomeScreen from '../Home';
import OptionScreen from '../Options';

const Tab = createBottomTabNavigator();

export default function Dashboard() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Icon name="home" />,
          }}
        />
        <Tab.Screen
          name="Option"
          component={OptionScreen}
          options={{
            title: "Options",
            tabBarIcon: ({ color, size }) => <Icon name="settings" />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
