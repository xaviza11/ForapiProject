import log from '../utils/coolog'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';

const Props = () => {

    log.pc('<--- Props --->')

    const navigation = useNavigation()

    const windowWidth = useSelector((state: {windowWidth: number}) => state.windowWidth)
    const windowHeight = useSelector((state: {windowHeight:number}) => state.windowHeight)
    const colorScheme = useSelector((state: {colorScheme: string}) => state.colorScheme)
    const propsItem = useSelector((state: any) => state.props)
    const language = useSelector((state: any) => state.language)

    return (
        <View style={{ width: windowWidth, height: windowHeight, backgroundColor: colorScheme === 'light' ? 'white' : 'black', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ borderColor: colorScheme === 'light' ? 'black' : 'white', borderWidth: 1, width: windowWidth - 140, height: 300, padding: 2 }}>
                    <ScrollView>
                        <Text style={[{ fontFamily: 'MontserratBold', color: colorScheme === 'light' ? 'black' : 'white' }]}>{propsItem.title}
                        </Text>
                        <Text style={[{ fontFamily: 'Montserrat', color: colorScheme === 'light' ? 'black' : 'white' }]}>{propsItem.description}
                        </Text>
                    </ScrollView>
                </View>
                <View style={{ height: 300, width: windowWidth - 250, alignItems: 'center' }}>
                    <ScrollView style={{ paddingRight: 20, borderColor: colorScheme === 'light' ? 'black' : 'white', borderWidth: 1, paddingLeft: 2, height: 300 }}>
                        {propsItem.props.map((item: any, index: number) => (
                            <View key={index}>
                                {typeof item === 'object' && item !== null && Object.keys(item).map((key) => (
                                    <View style={{ marginBottom: 6 }} key={key}>
                                        <Text style={{ fontFamily: 'MontserratBold', color: colorScheme === 'light' ? 'black' : 'white' }}>
                                            {key}:
                                        </Text>
                                        {item[key] !== undefined && Array.isArray(item[key]) ? (
                                            item[key].map((color: any, colorIndex: number) => (
                                                <Text style={{ fontFamily: 'Montserrat', color: colorScheme === 'light' ? 'black' : 'white' }} key={colorIndex}>
                                                    {color}
                                                    {colorIndex < item[key].length - 1} 
                                                </Text>
                                            ))
                                        ) : (
                                            <Text style={{ fontFamily: 'Montserrat' }}>
                                                {item[key]}
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <TouchableOpacity style={{ marginBottom: 20, marginTop: 20 }} onPress={() =>  navigation.navigate('Home' as never)}>
                    <Button title={language.exit} colorDark='white' colorLight='white' backgroundColorDark='rgb(60, 60, 60)' backgroundColorLight='rgb(60, 60, 60)'></Button>
                </TouchableOpacity>
        </View>
    );
}

export default Props