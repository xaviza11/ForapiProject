import * as SecureStore from 'expo-secure-store';

export default async function retrieveItemNative(itemName: string): Promise<any> {
    try {
        const value = await SecureStore.getItemAsync(itemName);
        return value;
    } catch (error) {
        console.error('Error retrieving item:', error);
        return null;
    }
}

