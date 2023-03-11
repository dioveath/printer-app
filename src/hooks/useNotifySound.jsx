import { createContext, useEffect, useState } from "react";
import { Audio } from "expo-av";

export const useNotifySound = () => {
    const [notifySound, setNotifySound] = useState(null);
    
    useEffect(() => {
        (async () => {
        const { sound } = await Audio.Sound.createAsync(
            require("../../assets/sounds/notification.mp3"),
            { shouldPlay: false, isLooping: true });
        setNotifySound(sound);
        })();
    }, []);
    
    return notifySound;
};

export const SoundContext = createContext(null);

export const SoundProvider = ({ children }) => {
    const notifySound = useNotifySound();
    const [isPlaying, setPlaying] = useState(false);

    const playSound = async () => {
        if(!notifySound) return;
        await notifySound?.playAsync();
        setPlaying(true);
    }

    const stopSound = async () => {
        if(!notifySound) return;
        await notifySound?.stopAsync();
        setPlaying(false);
    }

    return (
        <SoundContext.Provider value={{playSound, stopSound, isPlaying}}>
            {children}
        </SoundContext.Provider>
    );
}