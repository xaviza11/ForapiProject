/*import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import finishValidation from './storage.finish';
import log from './coolog';

export default function saveItem(key, value) {
  try {
    AsyncStorage.setItem(key, value);
  } catch (error) {
    log.fatal('Fatal error on storage');
  } finally{
    return finishValidation(key, value)
  }
}*/