import React, {useRef, useEffect } from 'react';
import {Text, View, ActivityIndicator, Image, Animated } from 'react-native';
import log from '../utils/coolog';
import containers from '../styles/containers';
import logos from '../styles/logos';

export default function App() {

  log.pc('<-- App -->')

  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        fadeIn(),
        fadeOut(),
      ])
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  return (
    <View style={containers.containerLoadingClose}>
      <Image source={require('../../assets/Forapi.png')} style={logos.logo} />
      <ActivityIndicator size="large" color="#000000" />
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text>Loading...</Text>
      </Animated.View>
    </View>
  );
}

