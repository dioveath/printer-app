import { View, Text, TouchableOpacity, Animated } from 'react-native'
import React, { useState } from 'react'

export default function MyTabBar({ state, descriptors, navigation, position }) {
    const inputRange = state.routes.map((_, i) => i);
    const tabPercent = Math.max(4, Math.min(8, parseInt(100 / state.routes.length)));
    const [tabWidth, setTabWidth] = useState(0);
    const onLayout = (e) => {
        const { width } = e.nativeEvent.layout;
        setTabWidth(width);        
    }            

    const singleTabWidth = tabWidth / state.routes.length;    
    const offset = singleTabWidth/2;

    const tabPos = position.interpolate({
        inputRange,
        outputRange: inputRange.map(i => i === state.index ? ((tabWidth * (i / state.routes.length)) + offset) : 0)
    });


  return (
    <View onLayout={onLayout} className="bg-white shadow-2xl mb-[1px]" >
    <View className='relative my-2' >
        <View className="w-full h-[1px] bg-orange-500 absolute top-[3px]" />
        <Animated.View className={`h-[6px] bg-orange-500`} style={{
            width: `${tabPercent}%`,
            transform: [ { translateX: tabPos } ]
        }}/>
    </View>
    
    <View className='w-full flex flex-row justify-between items-center'>
        { state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
            const isFocused = state.index === index;

            const onPress = () => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                }
            };

            const onLongPress = () => {
                navigation.emit({ type: 'tabLongPress', target: route.key });                
            };

            // const inputRange = state.routes.map((_, i) => i);
            const opacity = position.interpolate({ 
                inputRange,
                outputRange: inputRange.map(i => i === index ? 1 : 0.5) 
            });

            return (
            <TouchableOpacity key={index} onPress={onPress} onLongPress={onLongPress} 
            className='flex-1 py-2 justify-center items-center flex flex-row'>
                <Animated.Text style={{opacity}} className=''>
                    { label }
                </Animated.Text>
            </TouchableOpacity>);
        })}
    </View>
    </View>    
  )
}