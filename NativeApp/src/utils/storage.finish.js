/*import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import log from './coolog';

export default async function finishValidation(key, value) {
  try {
    let res = false
    const b = await SecureStore.getItemAsync(key)
    if(b !== undefined) res = true
    return res
  } catch (error) {
    let res = false
    const a = await AsyncStorage.getItem(key)
    if(typeof a === 'string') res = true
    return res
  }
}*/