import log from '../utils/coolog'
import {Text,View, Image, ActivityIndicator, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import saveItem from '../utils/storage.saveItem.native';
import { useDispatch } from 'react-redux';
import { isRetrieveLikes, resetContentList, selectItem, selectProps, selectStore, setBasketItems, setUser, toggleAlert, toggleSearcher } from '../actions/actions';
import { useNavigation } from '@react-navigation/native';
import containers from '../styles/containers';
import logos from '../styles/logos';

const CloseApp = () => {

  log.pc('<--- CloseApp --->')

  const navigation = useNavigation()

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch()

  useEffect(() => {
    Animated.sequence([
      fadeIn(),
      fadeOut(),
    ]).start();
    resetStates();
    setTimeout(() => {
      navigation.navigate('Login' as never)
    }, 1200)
  }, []);

  const fadeIn = () => {
    return Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
  };

  const fadeOut = () => {
    return Animated.timing(fadeAnim, {
      toValue: 0.4,
      duration: 1000,
      useNativeDriver: true,
    });
  };

  const resetStates = () => {

    log.info('CloseApp -> ResetStates')

    dispatch(setUser({}))
    dispatch(selectProps({}))
    dispatch(selectItem({}))
    dispatch(resetContentList())
    dispatch(isRetrieveLikes(false))
    dispatch(toggleSearcher(false))
    dispatch(setBasketItems([]))
    dispatch(selectStore([]))
    dispatch(toggleAlert(false))
    saveItem('token', 'none')
    saveItem('basket', 'none')
    saveItem('locationLat', '40.63785648440559')
    saveItem('locationLon', '0.63785648440559')
    saveItem('locationAcc', '0')
  }

  return (
    <View style={containers.containerLoadingClose}>
      <Image source={require('../../assets/Forapi.png')} style={logos.logo} />
      <ActivityIndicator size="large" color="#000000" />
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text>Closing...</Text>
      </Animated.View>
    </View>
  );
}

export default CloseApp;
