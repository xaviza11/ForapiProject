import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const CustomPicker = (props: {items: any, selectedItem:string, onValueChange: any }) => {
  const [showPicker, setShowPicker] = useState(false);

  const {items, selectedItem, onValueChange} = props

  const itemLabels = items.map(item => item.item);
 const itemValues = items.map(item => item.value);

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleItemPress = (item: string) => {
    togglePicker();
    onValueChange(item);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pickerButton} onPress={togglePicker}>
        <Text>{selectedItem}</Text>
        <Text style={{marginLeft: 5, borderColor: 'black', borderWidth: 1, borderRadius: 100, width: 20, textAlign: 'center'}}>⬇</Text>
      </TouchableOpacity>
      {showPicker && (
        <View style={styles.picker}>
          {itemLabels.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.pickerItem}
              onPress={() => handleItemPress(itemValues[index])}
            >
              <Text style={{fontSize: 14, fontFamily: 'Montserrat'}}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    backgroundColor: 'white',
    width: 320,
    borderWidth: 1,
    borderColor: 'black',
  },
  pickerItem: {
    width: 318,
    borderBottomWidth: 1,
    paddingLeft: 4,
    paddingTop: 2,
    paddingBottom: 2,
    borderColor: 'black',
    backgroundColor: 'white'
  },
});

export default CustomPicker;
