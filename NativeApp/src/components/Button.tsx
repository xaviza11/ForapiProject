// Button.js
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import texts from '../styles/texts';
import buttons from '../styles/buttons';

const Button = (props: { title: any, colorLight: string, colorDark: string, backgroundColorLight: string, backgroundColorDark: string}) => {
    
    const { title, colorLight, colorDark, backgroundColorLight, backgroundColorDark} = props
    const colorScheme = useSelector((state:any) => state.colorScheme)
    
    return (
        <View style={[buttons.button, { backgroundColor: colorScheme === 'light' ? backgroundColorLight : backgroundColorDark}]}>
            <Text style={[texts.buttonText, { color: colorScheme === 'light' ? colorLight : colorDark }]}>
                {title}
            </Text>
        </View>
    );
};

export default Button;
