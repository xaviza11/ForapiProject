import * as SecureStore from 'expo-secure-store';

export default function retrieveItemNative(itemName: string): Promise<void> {
    return SecureStore.deleteItemAsync(itemName);
}
