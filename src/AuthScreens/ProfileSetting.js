import React, { useEffect, useState, useContext } from 'react'
import {
    TextInput,
    View,
    Text,
    Image,
    StatusBar,
    ImageBackground,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserConsumer } from '../Context/UserContext';
import deflt from '../../assets/default.png';
import bg from '../../assets/bg2.jpg';
export default function ProfileSetting() {
    const [state, setState] = useState({
        name: "",
        profilePicture: deflt,
        userId: ""
    });
    const [picture, setPicture] = useState(deflt);

    const uploadProfile = async () => {

        const data = state;

        firestore()
            .collection('Users')
            .doc(data.userId)
            .set(data)
            .then((snap) => {
                alert("User Added Successfully!");

            })
            .catch((err) => alert("An error occured!"));
    };


    const PickPicture = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            const source = { uri: res.uri }
            setState({ ...state, profilePicture: source });
            setPicture(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }


    return (
        <>
            <StatusBar barStyle="dark-content" />
            <UserConsumer>
                {(value) => {

                    return <ImageBackground source={bg} style={{ flex: 1 }}>

                        <View style={styles.main} >

                            <View style={{ width: `${100}%`, alignItems: "center", marginTop: `${28}%` }}>
                                <View style={styles.profilepicker}>
                                    <Image style={styles.profilePicture} source={picture} />
                                    <Icon name="camera" style={{ position: "absolute", bottom: 6, right: 4 }} size={20} color="white" onPress={() => {
                                        PickPicture();
                                        setState({ ...state, userId: value });
                                    }} />
                                </View>
                                <View style={styles.namePicker}>
                                    <Text style={{ color: "white", fontSize: 17 }}>Enter Name</Text>
                                    <TextInput placeholder='Name' style={styles.input} onChangeText={(text) => { setState({ ...state, name: text }); }} />
                                </View>

                            </View>
                            <TouchableOpacity style={styles.button} onPress={() => { uploadProfile(); }}>

                                <Text style={styles.buttonText}>Add Profile</Text>

                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                }}
            </UserConsumer>



        </>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: "center",
    },
    profilepicker: {
        width: 130,
        height: 130,
        justifyContent: "center",
        alignItems: "center",
    },
    profilePicture: {
        width: `${100}%`,
        height: `${100}%`,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "white",
    },
    namePicker: {
        marginTop: `${10}%`,
        alignItems: "center",
        width: `${100}%`,
    },
    input: {
        padding: 0,
        marginTop: `${1}%`,
        width: `${50}%`,
        fontSize: 15,
        textAlign: "center",
        letterSpacing: 3,
        color: "white",
        borderBottomColor: "white",
        borderBottomWidth: 1
    },

    button: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: `${100}%`,
        height: 40,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: '#FFDAB9',
        justifyContent: "center"
    },
    buttonText: {
        alignSelf: "center",
        color: '#fff',
        fontSize: 16,
        fontFamily: "arial",
    },
})