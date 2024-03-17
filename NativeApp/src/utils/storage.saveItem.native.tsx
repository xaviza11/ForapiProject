import * as SecureStore from 'expo-secure-store';

export default function saveItemNative(key: string, value: string): boolean {
  let res = false;

  SecureStore.setItemAsync(key, value);
  res = true;

  return res;
}


