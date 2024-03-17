import log from '../utils/coolog'
import { Text, Pressable, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import secretPassGen from '../utils/secretPassGen';
import retrieveItem from '../utils/storage.retrieveItem.native';
import saveItem from '../utils/storage.saveItem.native';
import addItemToBasket from '../middlewares/addItemToBasket'
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';
import {toggleAlert } from '../actions/actions';
import Button from '../components/Button';
import containers from '../styles/containers';
import texts from '../styles/texts';
import buttons from '../styles/buttons';

const AddToBasket = () => {

    log.pc('<--- AddToBasket --->')

    const navigation = useNavigation()
    const dispatch = useDispatch()

    const itemSelected = useSelector((state: any) => state.itemSelected)
    const language = useSelector((state: any) => state.language)
    const host = useSelector((state: {host:string}) => state.host)
    const colorScheme = useSelector((state: {colorScheme:string}) => state.colorScheme)
    const windowWidth = useSelector((state: {windowWidth:number}) => state.windowWidth)
    const windowHeight = useSelector((state: {windowHeight:number}) => state.windowHeight)
    const isAlertOpen = useSelector((state: {isAlertOpen:boolean}) => state.isAlertOpen)

    const [quantity, setQuantity] = useState(0)
    const [selectedValues, setSelectedValues] = useState(() => {
        return itemSelected.props.map((propsObject: any) => {
            const firstPropertyName = Object.keys(propsObject)[0];
            return propsObject[firstPropertyName][0];
        });
    });
    const [message, setMessage] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    const handlePickerChange = (index: number, value: any) => {
        const newSelectedValues = [...selectedValues];
        newSelectedValues[index] = value;
        setSelectedValues(newSelectedValues);
    };

    const handlerAddToBasket = async () => {

        log.info('addToBasket -> handlerAddToBasket')

        const retrieveToken = await retrieveItem('token')
        const retrieveEmail = await retrieveItem('email')
        const retrieveBasket = await retrieveItem('basket')
        const secretPass = secretPassGen(retrieveToken, retrieveEmail)

        try {
            addItemToBasket(retrieveBasket, secretPass, retrieveToken, { id: itemSelected._id, quantity: quantity, collection: itemSelected.collectionName, props: selectedValues }, language, host)
                .then(result => {
                    saveItem('token', result)
                    setStatus('ok')
                    setMessage(language.productAdded)
                    dispatch(toggleAlert(true))
                })
                .catch((error) => {
                    if (error === 'jwt expired') {
                        setStatus('error')
                        setMessage(language.sessionExpired)
                        dispatch(toggleAlert(true))
                    }
                    else
                    setStatus('warn')
                    setMessage(error)
                    dispatch(toggleAlert(true))
                })
        } catch (error) {
            setStatus('warn')
            setMessage(error)
            dispatch(toggleAlert(true))
        }
    }

    return (
        <View style={{ width: windowWidth, height: windowHeight, position: 'absolute', top: 0, zIndex: 2, backgroundColor: colorScheme === 'light' ? 'white' : 'black' }}>
            <View style={{ marginTop: 0, backgroundColor: colorScheme === 'light' ? 'black' : 'black' }}>
                <ScrollView style={{ width: windowWidth, height: windowHeight, backgroundColor: colorScheme === 'light' ? 'white' : 'black' }}>
                    <Text style={{ zIndex: 100, position: 'absolute', top: 0, color: colorScheme === 'light' ? 'white' : 'white', backgroundColor: colorScheme === 'light' ? 'black' : 'gray', width: windowWidth, fontFamily: 'GreatVibes', fontSize: 35, textAlign: 'center' }}>{language.addToBasket}</Text>
                    <View style={[containers.containerAddToBasket, { width: windowWidth, height: windowHeight, backgroundColor: colorScheme === 'light' ? 'white' : 'dark' }]}>
                    <View style={{
                position: 'absolute',
                top: '25%',
                zIndex: 100,
            }}>
                {isAlertOpen && <CustomAlert message={message} status={status} />}
            </View>
                        <Text style={{ fontSize: 16, fontFamily: 'MontserratBold', marginBottom: 20, color: colorScheme === 'light' ? 'black' : 'white' }}>{itemSelected.title}</Text>
                        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                            <Text style={[texts.priceAddToBasket, { marginRight: 2 }]}>{itemSelected.price}</Text>
                            <Text style={[texts.priceAddToBasket]}>{itemSelected.currency}</Text>
                        </View>
                        <Text>{itemSelected.description}</Text>
                        {itemSelected.props.map((propsObject: any, index: number) => (
                            <Picker
                                key={index}
                                style={{ width: windowWidth / 2, backgroundColor: colorScheme === 'light' ? 'white' : 'gray' }}
                                selectedValue={selectedValues[index]}
                                onValueChange={(value) => handlePickerChange(index, value)}
                                dropdownIconColor={colorScheme === 'light' ? 'black' : 'white'}
                            >
                                {Object.keys(propsObject).map((propertyName) => (
                                    propsObject[propertyName].map((item: any, subIndex: any) => (
                                        <Picker.Item key={`${index}_${subIndex}`} label={item} value={item} />
                                    ))
                                ))}
                            </Picker>
                        ))}
                        <Text style={{marginTop: 10}}>{language.quantity}: </Text>
                        <View style={[containers.addViewContainer, { width: windowWidth / 1.5 }]}>
                            <Pressable onPress={() => quantity > 0 && setQuantity(quantity - 1)}><Text style={[buttons.addButton, { backgroundColor: 'rgb(60, 60, 60)' }]}>-</Text></Pressable>
                            <Text style={[{ color: colorScheme === 'light' ? 'black' : 'white' }]}>{quantity}</Text>
                            <Pressable onPress={() => setQuantity(quantity + 1)}><Text style={[buttons.addButton, { backgroundColor: 'green' }]}>+</Text></Pressable>
                        </View>
                        <TouchableOpacity style={{ marginBottom: 20, marginTop: 20 }} onPress={() => handlerAddToBasket()}>
                            <Button title={language.add} colorDark='white' colorLight='white' backgroundColorDark='green' backgroundColorLight='green'></Button>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => navigation.navigate('Home' as never)}>
                            <Button title={language.exit} colorDark='white' colorLight='white' backgroundColorDark='rgba(60, 60, 60, 1)' backgroundColorLight='rgba(60, 60, 60, 1)'></Button>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default AddToBasket