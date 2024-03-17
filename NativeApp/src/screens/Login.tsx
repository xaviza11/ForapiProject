import log from '../utils/coolog'
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import saveItem from '../utils/storage.saveItem.native';
import secretPassGen from '../utils/secretPassGen';
import LanguagePicker from '../components/LanguagePicker';

import authenticateUser from '../middlewares/authenticateUser';

import { useDispatch, useSelector } from 'react-redux';
import { toggleAlert } from '../actions/actions';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';
import Button from '../components/Button'

import containers from '../styles/containers';
import texts from '../styles/texts';
import inputs from '../styles/inputs';
import links from '../styles/links'

const Login = () => {

    log.pc('<--- Login --->')

    const dispatch = useDispatch()

    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [hiddenPass, setHiddenPass] = useState(false)
    const [message, setMessage] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    const language = useSelector((state: any) => state.language)
    const host = useSelector((state: {host:string}) => state.host)
    const colorScheme = useSelector((state: {colorScheme:string}) => state.colorScheme)
    const isAlertOpen = useSelector((state: {isAlertOpen:boolean}) => state.isAlertOpen)

    const navigation = useNavigation()

    const toggleHiddenPass = (password: string) => {
        setHiddenPass(true)
        setPassword(password)
    }

    const handlerAuthenticateUser = async () => {
        log.info('Login -> handlerAuthenticateUser')
        try {
            if (email === undefined) {
                setStatus('warn')
                setMessage(language.emailEmpty)
                dispatch(toggleAlert(true))
                return
            }

            if(password === undefined) {
                setStatus('warn')
                setMessage(language.forgotPassword)
                dispatch(toggleAlert(true))
                return
            }

            const secretPass = secretPassGen('thisIsLogIn', email)
            authenticateUser(email, password || '', language, host, secretPass)
                .then((token) => handlerAddToken(token, email || ''))
                .catch(error => {
                    setStatus('warn')
                    setMessage(error)
                    dispatch(toggleAlert(true))
                    if (error === 'jwt expired') {
                        setStatus('error')
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

    const handlerAddToken = async (token: string, email: string) => {
        log.info('Login -> handlerAddToken')
        try {
            saveItem('token', token);
            saveItem('email', email)
            navigation.navigate('Home' as never)
        } catch (error) {
            setStatus('error')
            setMessage(error)
            dispatch(toggleAlert(true))
        }
    }

    return (
        <View style={[containers.container, { backgroundColor: colorScheme === 'light' ? 'white' : 'black' }]}>
            <View style={{
                position: 'absolute',
                top: '25%',
                zIndex: 100,
            }}>
                {isAlertOpen && <CustomAlert message={message} status={status} />}
            </View>
            <View style={[containers.container, { backgroundColor: colorScheme === 'light' ? 'white' : 'black' }]}>
                <Text style={[texts.text, { color: colorScheme === 'light' ? 'black' : 'white' }]}>Forapi</Text>
                <TextInput style={[inputs.input, inputs.registerInput]} placeholder={language.inputEmail} onChangeText={(text) => setEmail(text)} />
                <TextInput style={[inputs.input, inputs.registerInput]} placeholder={language.inputPassword} onChangeText={(text) => toggleHiddenPass(text)} secureTextEntry={hiddenPass} />
                <TouchableOpacity style={{ marginBottom: 10 }} onPress={handlerAuthenticateUser}>
                    <Button title={language.login} colorDark='white' colorLight='white' backgroundColorDark='rgba(60, 60, 60, 1)' backgroundColorLight='rgba(60, 60, 60, 1)'></Button>
                </TouchableOpacity>
                <Text style={links.link} onPress={() => navigation.navigate('Register' as never)}>{language.createNewAccount}</Text>
                <Text style={links.link} onPress={() => navigation.navigate('RecoveryPass' as never)}>{language.forgotPassword}</Text>
                <LanguagePicker language={language} colorScheme={colorScheme}></LanguagePicker>
            </View>
        </View>
    );
}

export default Login