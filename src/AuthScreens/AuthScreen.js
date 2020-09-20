import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    StatusBar,
    TextInput,
    View,
    Text,
    Image,
    ImageBackground,

    TouchableOpacity,
} from 'react-native';
import IntlPhoneInput from 'react-native-intl-phone-input';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import Img from "../../assets/Image1.png";
import Img1 from "../../assets/Verification.png";

const AuthScreen = ({ navigation, handleFirst }) => {
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [verified, setVerified] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');

    async function signInWithPhoneNumber(phoneNumber) {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
        handleFirst();
    }

    async function confirmCode() {
        try {
            await confirm.confirm(code);
            navigation.navigate('ProfileSetting');
        } catch (error) {
            console.log('Invalid code.', error);
        }
    }



    useEffect(() => {
        confirm ?
            auth().onAuthStateChanged((user) => {
                if (user) {
                    // Obviously, you can add more statements here, 
                    //       e.g. call an action creator if you use Redux. 
                    console.log('I am working');
                    // navigte the user away from the login screens: 

                }
                else {
                    // reset state if you need to  

                }
            }) : ""

    }, []);

    return (
        <>
            <StatusBar barStyle="dark-content" />

            {
                !confirm ? <View style={styles.main}>

                    <View style={styles.mainOne}>
                        <Image source={Img} style={styles.img} />
                    </View>
                    <View style={styles.mainTwo}>
                        <Text style={styles.mainHead}>Enter Your Phone Number</Text>
                        <View style={styles.mainInput}  >
                            <IntlPhoneInput style={styles.inputField} onChangeText={({ dialCode, unmaskedPhoneNumber, phoneNumber, isVerified }) => {
                                console.log(dialCode, unmaskedPhoneNumber, phoneNumber, isVerified);
                                setVerified(isVerified);
                                isVerified ?
                                    setPhoneNumber(dialCode + unmaskedPhoneNumber) : ""
                            }} defaultCountry="IN" />
                        </View>
                    </View>
                    <TouchableOpacity style={verified ? styles.button2 : styles.button} onPress={() => {
                        signInWithPhoneNumber(phoneNumber);
                    }}>

                        <Text style={styles.buttonText}>Submit</Text>

                    </TouchableOpacity>
                </View>
                    :
                    <View style={styles.main}>
                        <View style={styles.mainOne}>
                            {console.log(confirm)}
                            <Image source={Img1} style={styles.img} />
                        </View>
                        <View style={styles.mainTwo}>
                            <Text style={styles.mainHead}>Enter Verification Code</Text>
                            <View style={styles.mainInput}>
                                <TextInput keyboardType='numeric' style={styles.input} placeholder="Code" onChangeText={(Code) => {
                                    setCode(Code);
                                }} />
                            </View>
                        </View>
                        <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => {
                            signInWithPhoneNumber(phoneNumber);
                        }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Icon name="send-o" size={20} color="#000" />
                                <Text style={{ marginLeft: 7 }} >Resend</Text>
                            </View>
                        </TouchableOpacity>
                        {console.log(code)}
                        <TouchableOpacity style={code.length >= 6 ? styles.button2 : styles.button} onPress={() => {
                            confirmCode();
                        }}>

                            <Text style={styles.buttonText}>Verify Me</Text>

                        </TouchableOpacity>

                    </View>
            }

        </>
    );
};
const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#fff",
    },
    mainOne: {
        marginTop: `${15}%`,
        width: `${100}%`,
        flexDirection: "row",
        justifyContent: "center"
    },
    img: {
        width: 220,
        height: 220,
    },
    mainTwo: {
        paddingTop: `${8}%`,
        alignItems: "center",
        paddingBottom: `${2}%`,
    },
    mainHead: {
        fontSize: 15,
    },

    mainInput: {
        width: 200,

    },

    button: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: `${100}%`,
        height: 40,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: 'rgba(128,128,128,0.5)',
        justifyContent: "center"
    },
    button2: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: `${100}%`,
        height: 40,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: 'lightblue',
        justifyContent: "center"
    },
    resendButtton: {
        alignSelf: "center"
    },
    buttonText: {
        alignSelf: "center",
        color: '#fff',
        fontSize: 16,
        fontFamily: "arial",
    },
    input: {
        fontSize: 20,
        letterSpacing: 10,
        textAlign: "center",
        height: 50,
        width: `${100}%`,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 6,
    },
});
export default AuthScreen;