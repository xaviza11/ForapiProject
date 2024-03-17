import log from '../utils/coolog'
import { Text, TextInput, Pressable, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import retrieveItem from '../utils/storage.retrieveItem.native';
import saveItem from '../utils/storage.saveItem.native';
import secretPassGen from '../utils/secretPassGen';
import * as ImagePicker from 'expo-image-picker';
import ImageCache from '../components/ImageCache';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import CustomAlert from '../components/CustomAlert';

import { useDispatch, useSelector } from 'react-redux';

import Menu from '../components/Menu'
import { setLanguage,  setColorScheme, toggleAlert, changeUserImage, resetContentList } from '../actions/actions';

import * as Location from 'expo-location';

import updateUser from '../middlewares/updateUser';
import deleteAccount from '../middlewares/deleteAccount';
import uploadImage from '../utils/uploadImage'
import updateProfileImage from '../middlewares/updateProfileImage';

import containers from '../styles/containers';
import texts from '../styles/texts';
import inputs from '../styles/inputs';

const SettingsMenu = () => {

  log.pc('<--- SettingsMenu --->')

  const dispatch = useDispatch()
  const navigation = useNavigation()

  const user = useSelector((state: any) => state.user)
  const language = useSelector((state: any) => state.language)
  const colorScheme = useSelector((state: {colorScheme: string}) => state.colorScheme)
  const windowHeight = useSelector((state: {windowHeight:number}) => state.windowHeight)
  const windowWidth = useSelector((state: {windowWidth:number}) => state.windowWidth)
  const host = useSelector((state: {host:string}) => state.host)
  const isAlertOpen = useSelector((state: {isAlertOpen:string}) => state.isAlertOpen)

  const [location, setLocation] = useState<string>('')
  const [newEmail, setNewEmail] = useState<string>('')
  const [newName, setNewName] = useState<string>('')
  const [newPhone, setNewPhone] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [image, setImage] = useState(user.image)

  if (image === undefined) setImage('none')

  const [hiddenDeletePass, setHiddenDeletePass] = useState<boolean>(false)
  const [hiddenPass, setHiddenPass] = useState<boolean>(false)
  const [hiddenNewPass, setHiddenNewPass] = useState<boolean>(false)
  
  const [message, setMessage] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  const pickerRef = useRef<any>(null);
  const themeRef = useRef<any>(null); 

  const changeColorScheme = (value: string) => {
    dispatch(setColorScheme(value))
    dispatch(resetContentList())
  }

  const pickImage = async () => {

    log.info('Settings -> pickImage')

    if (user.gender === 'Personal') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri)
          .then(async (url) => {
            if (url !== false) {
              try {
                const retrieveToken = await retrieveItem('token')
                const retrieveEmail = await retrieveItem('email')
                const secretPass = secretPassGen(retrieveToken, retrieveEmail)
                updateProfileImage(url.url, 'none', secretPass, retrieveToken, host, language)
                  .then(async () => {
                    setImage(url.url);
                    saveItem('image', url.url)
                    dispatch(changeUserImage(url.url))
                  })
              } catch (error) {
                setStatus('warn')
                setMessage(error)
                dispatch(toggleAlert(true))
              }
            }
          })
          .catch(error => {
            setStatus('warn')
            setMessage(error)
            dispatch(toggleAlert(true))
          })
      }
    } else {
      setStatus('warn')
      setMessage(language.pleaseUseStoreApp)
      dispatch(toggleAlert(true))
      alert(language.pleaseUseStoreApp)
    }
  };

  const handlerDeleteAccount = async () => {

    log.info('Settings -> handlerDeleteAccount')

    if (password !== undefined) {
      try {
        const retrieveToken = await retrieveItem('token')
        const retrieveEmail = await retrieveItem('email')
        const secretPass = secretPassGen(retrieveToken, retrieveEmail)
        deleteAccount(retrieveToken, password, language, host, secretPass)
          .then(() => { navigation.navigate('CloseApp' as never) })
          .catch(error => {
            setStatus('error')
            setMessage(error)
            dispatch(toggleAlert(true))
          })
      } catch (error) {
        setStatus('warn')
        setMessage(error)
        dispatch(toggleAlert(true))
      }
    } else {
      setStatus('warn')
      setMessage(language.passwordNotString)
      dispatch(toggleAlert(true))
    }
  }

  const routerLanguage = (newLanguage: string) => {
    dispatch(setLanguage(newLanguage));
  }

  const handlerReset = () => {

    log.info('Settings -> handlerReset')

    setNewEmail('')
    setNewName('')
    setNewPhone('')
    setNewPassword('')
    navigation.navigate('CloseApp' as never)
  }

  const handlerUpdateUser = async () => {

    log.info('Settings -> handlerUpdateUser')

    if (password !== undefined) {
      try {
        const retrieveToken = await retrieveItem('token')
        const retrieveEmail = await retrieveItem('email')
        const secretPass = secretPassGen(retrieveToken, retrieveEmail)
        updateUser(retrieveToken, password, newEmail, newPassword, newName, newPhone, language, host, secretPass)
          .then(() => handlerReset())
          .catch(error => {
            alert(error.message)
          })
      } catch (error) {
        if (error === 'jwt expired') {
          setStatus('error')
          setMessage(error.sessionExpired)
          dispatch(toggleAlert(true))
        } else {
          setStatus('warn')
          setMessage(error)
          dispatch(toggleAlert(true))
        }
      }
    } else {
      setStatus('warn')
      setMessage(language.passwordNotString)
      dispatch(toggleAlert(true))
    }
  }

  const setPasswordText = (text: string) => {
    log.info('Settings -> setPasswordText')
    setHiddenPass(true)
    setPassword(text)
  }

  const setNewPasswordText = (text: string) => {
    log.info('Settings -> setNewPasswordText')
    setHiddenNewPass(true)
    setNewPassword(text)
  }

  const setDeleteText = (text: string) => {
    log.info('Settings -> setDeleteText')
    setHiddenDeletePass(true)
    setPassword(text)
  }

  const updateLocation = () => {
    log.info('Settings -> updateLocation')
    try {
      const locationWhitOutSpaces = location.replace(/ /g, "")
      const locValues = locationWhitOutSpaces.split(',')
      const latitude = locValues[0]
      const longitude = locValues[1]

      saveItem('locationLat', latitude)
      saveItem('locationLon', longitude)
    } catch (error) {
      setStatus('warn')
      setMessage('error on save location')
      dispatch(toggleAlert(true))
    }
  }

  const relocation = async () => {
    log.info('Settings -> relocation')
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setStatus('warn')
        setMessage('location denied')
        dispatch(toggleAlert(true))
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

  return (
    <View style={[containers.containerSettings, { backgroundColor: colorScheme === 'light' ? 'white' : 'black' }]}>
      <View style={[containers.formContainer, { height: windowHeight - 65, backgroundColor: colorScheme === 'light' ? 'white' : 'black' }]}>
        <View style={{
          position: 'absolute',
          top: '25%',
          zIndex: 100,
        }}>
          {isAlertOpen && <CustomAlert message={message} status={status} />}
        </View>
        <View style={{ height: windowHeight }}>
          <ScrollView showsVerticalScrollIndicator={false} style={[{ width: windowWidth }]}>
            <Text style={[texts.title, { backgroundColor: colorScheme === 'light' ? 'black' : 'gray', color: colorScheme === 'light' ? 'white' : 'white', marginTop: 30 }]}>{language.settings}</Text>
            <View style={containers.settingsProps}>
              <Text style={[texts.subTitle, { color: colorScheme === 'light' ? 'black' : 'white' }]}>{language.uploadProfilePhoto}</Text>
              <Pressable onPress={pickImage} style={{ marginTop: 10, borderRadius: 100, borderWidth: 1, borderColor: colorScheme === 'light' ? 'black' : 'white' }}>
                <ImageCache width={100} height={100} uri={image} radius={100}></ImageCache>
              </Pressable>
            </View>
            <View style={containers.settingsProps}>
              <Text style={[texts.subTitle, { color: colorScheme === 'light' ? 'black' : 'white' }]}>{language.changeLanguage}</Text>
              <View style={{ flexDirection: 'row', width: 110, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: colorScheme === 'light' ? 'black' : 'white', paddingRight: 2 }}>{language.currentLanguage}</Text>
                <Picker
                  ref={pickerRef}
                  style={{ color: colorScheme === 'light' ? 'black' : 'white', flex: 1, width: 20 }}
                  onValueChange={(value: string) => { routerLanguage(value) }}
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
            </View>
            <View style={containers.settingsProps}>
              <Text style={[texts.subTitle, { color: colorScheme === 'light' ? 'black' : 'white' }]}>{language.changeTheme}</Text>
              <View style={{ flexDirection: 'row', width: 90, justifyContent: 'center', alignItems: 'center' }}>
                <Picker
                  ref={themeRef}
                  style={{ color: colorScheme === 'light' ? 'black' : 'white', flex: 1, width: 20 }}
                  onValueChange={(value: string) => { changeColorScheme(value) }}
                  dropdownIconColor={colorScheme === 'light' ? 'black' : 'white'}
                >
                  <Picker.Item label={'...'} value={'...'} />
                  <Picker.Item label={language.light} value='light' />
                  <Picker.Item label={language.dark} value='dark' />
                </Picker>
              </View>
            </View>
            <View style={containers.settingsProps}>
              <Text style={[texts.subTitle, { color: colorScheme === 'light' ? 'black' : 'white' }]}>{language.changeCoordinates}</Text>
              <TextInput style={[inputs.input, inputs.settingInput, {borderRadius: colorScheme === 'light' ? 0 : 100 }]} placeholder={language.insertNewCoordinates} onChangeText={(text) => setLocation(text)} />
              <View style={containers.buttonsFlex}>
                <TouchableOpacity style={{ marginBottom: 20, marginTop: 10 }} onPress={() => updateLocation()}>
                  <Button title={language.send} colorDark='white' colorLight='white' backgroundColorDark='rgb(60, 60, 60)' backgroundColorLight='rgb(60, 60, 60)'></Button>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginBottom: 20, marginTop: 10 }} onPress={() => relocation()}>
                  <Button title={language.relocate} colorDark='white' colorLight='white' backgroundColorDark='rgb(60, 60, 60)' backgroundColorLight='rgb(60, 60, 60)'></Button>
                </TouchableOpacity>
              </View>
            </View>
            <View style={containers.settingsProps}>
              <Text style={[texts.subTitle, { color: colorScheme === 'light' ? 'black' : 'white' }]}>{language.updateUser}</Text>
              <TextInput style={[inputs.input, inputs.settingInput, {borderRadius: colorScheme === 'light' ? 0 : 100 }]} placeholder={language.newEmail} onChangeText={(text) => setNewEmail(text)} />
              <TextInput style={[inputs.input, inputs.settingInput, {borderRadius: colorScheme === 'light' ? 0 : 100 }]} placeholder={language.newName} onChangeText={(text) => setNewName(text)} />
              <TextInput style={[inputs.input, inputs.settingInput, {borderRadius: colorScheme === 'light' ? 0 : 100 }]} placeholder={language.newPhone} onChangeText={(text) => setNewPhone(text)} />
              <TextInput style={[inputs.input, inputs.settingInput, {borderRadius: colorScheme === 'light' ? 0 : 100 }]} placeholder={language.newPassword} onChangeText={(text) => setNewPasswordText(text)} secureTextEntry={hiddenNewPass} />
              <TextInput style={[inputs.input, inputs.settingInput, {borderRadius: colorScheme === 'light' ? 0 : 100 }]} placeholder={language.currentPassword} onChangeText={(text) => setPasswordText(text)} secureTextEntry={hiddenPass} />
              <View style={[{ flex: 1, alignItems: 'center' }]}>
                <TouchableOpacity style={{ marginBottom: 20, marginTop: 10 }} onPress={() => handlerUpdateUser()}>
                  <Button title={language.send} colorDark='white' colorLight='white' backgroundColorDark='rgb(60, 60, 60)' backgroundColorLight='rgb(60, 60, 60)'></Button>
                </TouchableOpacity>
              </View>
            </View>
            <View style={containers.settingsProps}>
              <Text style={[texts.subTitle, { color: colorScheme === 'light' ? 'black' : 'white' }]}>{language.deleteUser}</Text>
              <TextInput style={[inputs.input, inputs.settingInput, {borderRadius: colorScheme === 'light' ? 0 : 100 }]} placeholder={language.currentPassword} onChangeText={(text) => setDeleteText(text)} secureTextEntry={hiddenDeletePass} /> 
              <View style={[{ flex: 1, alignItems: 'center' }]}>
                <TouchableOpacity style={{ marginBottom: 20, marginTop: 10 }} onPress={() => handlerDeleteAccount()}>
                  <Button title={language.delete} colorDark='white' colorLight='white' backgroundColorDark='red' backgroundColorLight='red'></Button>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[{ flex: 1, alignItems: 'center', marginTop: 40, marginBottom: 20 }]}>
              <Text style={[texts.subTitle, { color: colorScheme === 'light' ? 'black' : 'white' }]}>{language.logout}</Text>
              <TouchableOpacity style={{ marginBottom: 20, marginTop: 10 }} onPress={() => navigation.navigate('CloseApp' as never)}>
                <Button title={language.exit} colorDark='white' colorLight='white' backgroundColorDark='rgb(60, 60, 60)' backgroundColorLight='rgb(60, 60, 60)'></Button>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

      <Menu handlerDisplayLikes={'none'} isOnHome={false}></Menu>
    </View>
  );
}

export default SettingsMenu