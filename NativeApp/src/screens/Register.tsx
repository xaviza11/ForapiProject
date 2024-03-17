import log from '../utils/coolog';
import React, { useState } from 'react';
import {  Text, TextInput, View, TouchableOpacity } from 'react-native';
import registerUser from '../middlewares/registerUser';
import secretPassGen from '../utils/secretPassGen';
import LanguagePicker from '../components/LanguagePicker';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import { toggleAlert } from '../actions/actions';
import CustomAlert from '../components/CustomAlert';

import { useDispatch, useSelector } from 'react-redux';
import containers from '../styles/containers';
import texts from '../styles/texts';
import inputs from '../styles/inputs';
import links from '../styles/links'

const Register = () => {

  log.pc('<--- Register --->')

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [storeCode] = useState<string>('none');
  const [phone, setPhone] = useState<string>('');
  const [hiddenPass, setHiddenPass] = useState<boolean>(false)
  const [hiddenRepPass, setHiddenRepPas] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  const language = useSelector((state: any) => state.language)
  const host = useSelector((state: {host: string}) => state.host)
  const colorScheme = useSelector((state: {colorScheme:string}) => state.colorScheme)
  const isAlertOpen = useSelector((state: {isAlertOpen:boolean}) => state.isAlertOpen)

  const dispatch = useDispatch()

  const navigation = useNavigation()

  const toggleHiddenPass = (password: string) => {

    log.info('Register -> toggleHiddenPass')

    setHiddenPass(true)
    setPassword(password)
  }

  const toggleHiddenRepPass = (repPass: string) => {

    log.info('Register -> toggleHiddenRepPass')

    setHiddenRepPas(true)
    setRepeatPassword(repPass)
  }

  const handleRegisterUser = () => {
    log.info('Register -> handleRegisterUser');

    if (storeCode) {
      if (password === repeatPassword) {
        try {
          const secretPass = secretPassGen('thisIsRegister', email);

          registerUser(name, email, password, repeatPassword, storeCode, phone, host, secretPass, language)
            .then(() => {
              setStatus('ok')
              setMessage(language.registerDone)
              dispatch(toggleAlert(true))
              setTimeout(() => {
                navigation.navigate('Login' as never)
              }, 1200)
            })
            .catch(error => {
              setStatus('warn')
              setMessage(error)
              dispatch(toggleAlert(true))
              if (error === 'jwt expired') {
                setStatus('error')
                setMessage(error)
                dispatch(toggleAlert(true))
              }
            });
        } catch (error) {
          setStatus('warn')
          setMessage(error)
          dispatch(toggleAlert(true))
          setPassword('');
          setRepeatPassword('');
        }
      } else {
        setStatus('warn')
        setMessage(language.passwordsNotMatch)
        dispatch(toggleAlert(true))
      }
    } else {
      setStatus('warn')
      setMessage(language.errorOnGender)
      dispatch(toggleAlert(true))
    }
  };

  return (
    <View style={[containers.container, { backgroundColor: colorScheme === 'light' ? 'white' : 'black' }]}>
      <View style={{
        position: 'absolute',
        top: '25%',
        zIndex: 100,
      }}>
        {isAlertOpen && <CustomAlert message={message} status={status} />}
      </View>
      <Text style={[texts.text, { color: colorScheme === 'light' ? 'black' : 'white' }]}>Forapi</Text>
      <TextInput style={[inputs.input, inputs.registerInput]} placeholder={language.inputUser} onChangeText={text => setName(text)} value={name} />
      <TextInput style={[inputs.input, inputs.registerInput]} placeholder={language.inputEmail} onChangeText={text => setEmail(text)} value={email} />
      <TextInput style={[inputs.input, inputs.registerInput]} placeholder={language.inputPhone} onChangeText={text => setPhone(text)} value={phone} />
      <TextInput style={[inputs.input, inputs.registerInput]} placeholder={language.inputPassword} onChangeText={text => toggleHiddenPass(text)} value={password} secureTextEntry={hiddenPass} />
      <TextInput style={[inputs.input, inputs.registerInput]} placeholder={language.repeatPassword} onChangeText={text => toggleHiddenRepPass(text)} value={repeatPassword} secureTextEntry={hiddenRepPass} />
      <TouchableOpacity style={{ marginBottom: 10 }} onPress={handleRegisterUser} >
        <Button title={language.register} colorDark='white' colorLight='white' backgroundColorDark='rgba(60, 60, 60, 1)' backgroundColorLight='rgba(60, 60, 60, 1)'></Button>
      </TouchableOpacity>
      <Text style={links.link} onPress={() => navigation.navigate('Login' as never)} >{language.haveAccount}</Text>
      <LanguagePicker language={language} colorScheme={colorScheme}></LanguagePicker>
    </View>
  );
};

export default Register;
