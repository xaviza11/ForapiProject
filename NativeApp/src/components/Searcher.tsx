import log from '../utils/coolog'
import React, { useState, useRef } from 'react';
import { Text, TextInput, View, Pressable, TouchableOpacity } from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import Button from './Button';
import createSearch from '../middlewares/createSearch';
import secretPassGen from '../utils/secretPassGen';
import retrieveItem from '../utils/storage.retrieveItem.native';
import saveItem from '../utils/storage.saveItem.native';
import {toggleAlert, resetContentList, toggleSearcher } from '../actions/actions';
import CustomAlert from './CustomAlert';
import containers from '../styles/containers';
import texts from '../styles/texts';
import inputs from '../styles/inputs';

const Searcher = (props: { handlerRetrieveSearch: any }) => {

    log.pc('<-- Searcher -->')

    const dispatch = useDispatch()

    const { handlerRetrieveSearch } = props

    const language = useSelector((state: any) => state.language)
    const colorScheme = useSelector((state: {colorScheme:string}) => state.colorScheme)
    const windowHeight = useSelector((state: {windowHeight:number}) => state.windowHeight)
    const windowWidth = useSelector((state: {windowWidth:number}) => state.windowWidth)
    const host = useSelector((state: {host:string}) => state.host)
    const isAlertOpen = useSelector((state: {isAlertOpen:boolean}) => state.isAlertOpen)

    const [slider, setSliderValue] = useState<any>(100)
    const [collection, setCollection] = useState<string>('furniture')
    const [tags, setTags] = useState<any>()
    const [message, setMessage] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    const pickerRef = useRef<any>();

    function open() {
        pickerRef.current.focus();
    }

    const handlerCreateSearch = async () => {
        log.info('Searcher -> handlerCreateSearch')

        const retrieveToken = await retrieveItem('token')
        const retrieveEmail = await retrieveItem('email')
        const lat = await retrieveItem('locationLat')
        const lon = await retrieveItem('locationLon')
        const acc = await retrieveItem('locationAcc')

        const secretPass = secretPassGen(retrieveToken, retrieveEmail)

        try {
            createSearch(retrieveToken, tags, 0, lat, lon, slider, acc, language, host, collection, secretPass)
                .then(result => {
                    saveItem('token', result.token)
                    const response = { search: result.furniture, collection: 'none' }
                    dispatch(resetContentList())
                    dispatch(toggleSearcher(false))
                    handlerRetrieveSearch(response)
                })
                .catch((error) => {
                    if (error === 'jwt expired') {
                        setStatus('error')
                        setMessage(language.sessionExpired)
                        dispatch(toggleAlert(true))
                    }
                    else {
                        setStatus('warn')
                        setMessage(error)
                        dispatch(toggleAlert(true))
                    }
                })
        } catch (error) {
            setStatus('warn')
            setMessage(error)
            dispatch(toggleAlert(true))
        }
    }

    return (
        <View style={[containers.shadow, { width: windowWidth - 20, height: windowHeight }]}>
            <View style={[containers.containerSearcher, { backgroundColor: colorScheme === 'light' ? 'white' : 'rgb(25, 25, 25)', borderColor: colorScheme === 'light' ? 'black' : 'white', width: windowWidth - 20, top: windowHeight / 4 }]}>
                <View style={{
                    position: 'absolute',
                    top: '25%',
                    zIndex: 100,
                }}>
                    {isAlertOpen && <CustomAlert message={message} status={status} />}
                </View>
                <View style={[containers.inputContainer]}>
                    <TextInput placeholder={language.searchItems} style={[inputs.input, {borderRadius: 25, padding: 4, backgroundColor: 'white', width: windowWidth - 120 }]} onChangeText={(text) => setTags(text)} />
                </View>
                <View style={{flex: 1, alignItems: 'center',}}>
                    <View style={containers.sliderContainer}>
                        <Slider
                            step={10}
                            minimumValue={10}
                            maximumValue={300}
                            value={slider}
                            onValueChange={(value) => {
                                setSliderValue(value)
                            }}
                            thumbTintColor={colorScheme === 'light' ? 'black' : 'white'}
                            maximumTrackTintColor={colorScheme === 'light' ? 'black' : 'white'}
                            minimumTrackTintColor={colorScheme === 'light' ? 'black' : 'white'}
                        />
                        <Text style={[texts.sliderText, { color: colorScheme === 'light' ? 'black' : 'white' }]}>{language.searchIn}{slider}{language.km}</Text>
                        <Pressable onPress={open} style={{ width: 200, height: 40, alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', }}>
                                <Picker
                                    ref={pickerRef}
                                    style={{ flex: 1, width: 150, color: colorScheme === 'light' ? 'black' : 'white' }}
                                    selectedValue={collection}
                                    onValueChange={(itemValue) => setCollection(itemValue)}
                                    dropdownIconColor={colorScheme === 'light' ? 'black' : 'white'}
                                ><Picker.Item label={language.furniture} value="furniture" />
                                    <Picker.Item label={language.books} value="books" />
                                    <Picker.Item label={language.tv} value="tv" />
                                    <Picker.Item label={language.music} value="music" />
                                    <Picker.Item label={language.photography} value="photography" />
                                    <Picker.Item label={language.phones} value="phones" />
                                    <Picker.Item label={language.computers} value="computers" />
                                    <Picker.Item label={language.electronics} value="electronics" />
                                    <Picker.Item label={language.office} value="office" />
                                    <Picker.Item label={language.games} value="games" />
                                    <Picker.Item label={language.toys} value="toys" />
                                    <Picker.Item label={language.kids} value="kids" />
                                    <Picker.Item label={language.home} value="home" />
                                    <Picker.Item label={language.tools} value="tools" />
                                    <Picker.Item label={language.beautyAndHealth} value="beautyAndHealth" />
                                    <Picker.Item label={language.clothes} value="clothes" />
                                    <Picker.Item label={language.shoes} value="shoes" />
                                    <Picker.Item label={language.jewelry} value="jewelry" />
                                    <Picker.Item label={language.sport} value="sport" />
                                    <Picker.Item label={language.cars} value="cars" />
                                    <Picker.Item label={language.motorbikes} value="motorbikes" />
                                </Picker>
                            </View>
                        </Pressable>
                    </View>
                    <TouchableOpacity style={{ marginBottom: 20, marginTop: 20 }} onPress={() => handlerCreateSearch()}>
                        <Button title={language.search} colorDark='white' colorLight='white' backgroundColorDark='rgb(60, 60, 60)' backgroundColorLight='rgb(60, 60, 60)'></Button>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

};

export default Searcher;