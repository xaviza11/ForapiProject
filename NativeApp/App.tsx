import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import {View} from 'react-native';
import store from './src/store';
import { Provider} from 'react-redux';
import { useFonts } from 'expo-font';
import log from './src/utils/coolog';
import 'react-native-gesture-handler'

import * as Location from 'expo-location';

import Login from './src/screens/Login'
import Register from './src/screens/Register'
import RecoveryPass from './src/screens/RecoveryPass';
import Settings from './src/screens/Settings'
import Loading from './src/components/Loading';
import Home from './src/screens/Home';
import Basket from './src/screens/Basket';
import BasketRequest from './src/screens/BasketRequest';
import StorePage from './src/screens/StorePage';
import Props from './src/screens/Props'
import CloseApp from './src/screens/CloseApp'

import saveItem from './src/utils/storage.saveItem.native';
import retrieveItem from './src/utils/storage.retrieveItem.native';
import AddToBasket from './src/screens/AddToBasket';
//import Chat from './src/screens/Chat';

const Stack = createStackNavigator();

export default function App() {

  log.pc('<--- App -->')

  const [ready, setReady] = useState<boolean>(false)
  const [token, setToken] = useState<string>('none')

  const validateToken = async () => {
    try {
      const token = await retrieveItem('token')
      if (typeof token === 'string') setToken(token)
    } catch (error) { console.log(error) }
  }

  validateToken()



  const [fontsLoaded] = useFonts({
    BadScript: require("./assets/fonts/BadScript.ttf"),
    GreatVibes: require("./assets/fonts/GreatVibes.ttf"),
    Montserrat: require("./assets/fonts/Montserrat.ttf"),
    MontserratBold: require("./assets/fonts/Montserrat-Bold.ttf")
  })

  const setLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('location denied');
      return;
    }

    const currentLocation = await Location.getLastKnownPositionAsync();

    if (currentLocation !== null) {
      saveItem('locationLat', currentLocation.coords.latitude.toString())
      saveItem('locationLon', currentLocation.coords.longitude.toString())
      saveItem('locationAcc', '0')
    } else {
      saveItem('locationLat', '40.63785648440559')
      saveItem('locationLon', '0.63785648440559')
      saveItem('locationAcc', '0')
    }
  }

  setLocation()

  if (fontsLoaded) setTimeout(() => { setReady(true) }, 1500)

  return (
    <Provider store={store}>
      <NavigationContainer>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <StatusBar hidden={true} />
          {ready ? (
            <Stack.Navigator initialRouteName={token === 'none' ? 'Login' : 'Home'}>
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
              <Stack.Screen name="RecoveryPass" component={RecoveryPass} options={{ headerShown: false }} />
              <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
              <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
              <Stack.Screen name="Basket" component={Basket} options={{ headerShown: false }} />
              <Stack.Screen name="BasketRequest" component={BasketRequest} options={{ headerShown: false }} />
              <Stack.Screen name="StorePage" component={StorePage} options={{ headerShown: false }} />
              <Stack.Screen name="AddToBasket" component={AddToBasket} options={{ headerShown: false }} />
              <Stack.Screen name="Props" component={Props} options={{ headerShown: false }} />
              <Stack.Screen name="CloseApp" component={CloseApp} options={{ headerShown: false }} />
            </Stack.Navigator>
          ) : (
            <Loading />
          )}
        </View>
      </NavigationContainer>
    </Provider>
  );
}

