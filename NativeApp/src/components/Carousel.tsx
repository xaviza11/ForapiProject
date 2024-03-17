import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import log from '../utils/coolog';

import { useSelector } from 'react-redux';

import ImageCache from './ImageCache';

export default function Carousel(props: {img: []}) {
  log.pc('<--- Carousel --->');

  const { img } = props;

  const windowWidth = useSelector((state: any) => state.windowWidth)
  const halfWindowWidth = windowWidth / 2; 

  const [index, setIndex] = useState<number>(0);

  const handlePrevImage = () => {

    log.info('Carousel -> handlePrevImage')

    setIndex(index === 0 ? img.length - 1 : index - 1); 
  };

  const handleNextImage = () => {

    log.info('Carousel -> handleNextImage')

    setIndex(index === img.length - 1 ? 0 : index + 1); 
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginLeft: 0 }}>
      <View style={{ position: 'absolute', top: 10, right: 20, zIndex: 1, borderWidth: 1, padding: 1, width: 30, borderRadius: 30, alignItems: 'center', backgroundColor: 'black', borderColor: 'white' }}>
        <Text style={{ color: 'white', fontSize: 12 }}>{index + 1}/{img.length}</Text>
      </View>
      <Pressable onPress={({ nativeEvent }) => {
        const { locationX } = nativeEvent;
        if (locationX < halfWindowWidth) {
          handlePrevImage();
        } else {
          handleNextImage();
        }
      }}>
        <ImageCache width={windowWidth} height={windowWidth} uri={img[index]} radius={20} />
      </Pressable>
    </View>
  );
}
