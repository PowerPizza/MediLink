import AsyncStorage from "@react-native-async-storage/async-storage";

const setItem = async (key, value)=>{
    await AsyncStorage.setItem(key, value);
}

const getItem = async (key) => {
    return await AsyncStorage.getItem(key);
}

const removeItem = async (key) => {
    await AsyncStorage.removeItem(key);
}

export const AsyncStorageDriver = {setItem, getItem, removeItem}