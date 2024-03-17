import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { setLanguage } from '../actions/actions';
import { useDispatch } from 'react-redux';

const LanguagePicker = (props: any) => {

  const pickerRef = useRef<any>(null);

  const dispatch = useDispatch()

  const { language, colorScheme } = props

  const routerLanguage = (newLanguage: string) => {
    dispatch(setLanguage(newLanguage));
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 30, marginTop: 5, marginRight: 5 }}>
      <View style={[{ alignItems: 'center', width: 20 }]}>
        <Picker
          ref={pickerRef}
          style={{ flex: 1, width: 45 }}
          selectedValue={'...'}
          onValueChange={(itemValue) => routerLanguage(itemValue as string)}
          dropdownIconColor={colorScheme === 'light' ? 'black' : 'white'}
        >
          <Picker.Item label={'...'} value={'...'} />
          <Picker.Item label={language.Spanish} value='es' />
          <Picker.Item label={language.Italian} value='it' />
          <Picker.Item label={language.Catalonian} value='cat' />
          <Picker.Item label={language.Germany} value='ger' />
          <Picker.Item label={language.Romanian} value='ru' />
          <Picker.Item label={language.French} value='fr' />
          <Picker.Item label={language.English} value='en' />
          <Picker.Item label={language.Basque} value='eu' />
          <Picker.Item label={language.Portuguese} value='pt' />
          <Picker.Item label={language.Galician} value='gl' />
        </Picker>
      </View>
      <Text style={{ fontSize: 10, color: 'gray' }}>{language.currentLanguage}</Text>
    </View>
  );
};

export default LanguagePicker;
