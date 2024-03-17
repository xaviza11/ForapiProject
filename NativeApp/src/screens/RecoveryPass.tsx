import log from '../utils/coolog';
import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native'
import secretPassGen from '../utils/secretPassGen';
import recoveryAccount from '../middlewares/recoveryAccount';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LanguagePicker from '../components/LanguagePicker';
import Button from '../components/Button';
import { toggleAlert } from '../actions/actions';
import CustomAlert from '../components/CustomAlert';
import containers from '../styles/containers';
import texts from '../styles/texts';
import inputs from '../styles/inputs';
import links from '../styles/links'

const RecoveryPass = ({ }) => {

    log.pc('<--- RecoveryPass -->')

    const dispatch = useDispatch()

    const [email, setEmail] = useState<string | undefined>();
    const [message, setMessage] = useState<string>('')
    const [status, setStatus] = useState<string>('')

    const language = useSelector((state: any) => state.language)
    const host = useSelector((state: {host:string}) => state.host)
    const colorScheme = useSelector((state: {colorScheme:string}) => state.colorScheme)
    const isAlertOpen = useSelector((state: {isAlertOpen:boolean}) => state.isAlertOpen)

    const navigation = useNavigation()

    const handlerRecoveryAccount = () => {
        log.info('RecoveryPass --> handlerRecoveryAccount');

        try {
            if (!email) throw new Error(language.inputEmail);

            const secretPass = secretPassGen('thisIsRecoveryPass', email);

            recoveryAccount(email, host, secretPass, language)
                .catch(error => {
                    setStatus('warn')
                    setMessage(error.message)
                    dispatch(toggleAlert(true))
                    if (error === 'jwt expired') {
                        setStatus('error')
                        setMessage(error.message)
                        dispatch(toggleAlert(true))
                    }
                });
        } catch (error: any) {
            setStatus('warn')
            setMessage(error.message)
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
            <TextInput style={[inputs.input, {borderRadius: 25, marginBottom: 10, backgroundColor: 'white' }]} placeholder={language.inputEmail} onChangeText={(text) => setEmail(text)} />
            <Text style={[texts.weSendEmail, { color: colorScheme === 'light' ? 'black' : 'white' }]}>{language.weSendEmail}</Text>
            <TouchableOpacity onPress={handlerRecoveryAccount}>
                <Button title={language.login} colorDark='white' colorLight='white' backgroundColorDark='rgba(60, 60, 60, 1)' backgroundColorLight='rgba(60, 60, 60, 1)'></Button>
            </TouchableOpacity>
            <Text style={links.link} onPress={() => navigation.navigate('Login' as never)}>{language.goLogin}</Text>
            <LanguagePicker language={language} colorScheme={colorScheme}></LanguagePicker>
        </View>
    );
};

export default RecoveryPass;
