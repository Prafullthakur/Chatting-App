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
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import { UserConsumer } from '../Context/UserContext';
import Home from '../Components/HomeScreen';
import deflt from '../../assets/default.png';
import bg from '../../assets/bg2.jpg';
export default function ProfileSetting() {
    const [state, setState] = useState({
        name: "",
        profilePicture: deflt,
        userId: "",
        phoneNumber: ""
    });
    const [picture, setPicture] = useState(deflt);
    const [done, setDone] = useState(false);
    const user = useContext(UserConsumer);
    const uploadProfile = async () => {

        const data = state;

        firestore()
            .collection('Users')
            .doc(data.userId)
            .set(data)
            .then((snap) => {
                alert("User Added Successfully!");
                setDone(true);
            })
            .catch((error) => { alert("An error occured!"), console.log(error) });
    };

    const options = { quality: 1, maxWidth: 500, maxHeight: 500, allowsEditing: false, storageOptions: { skipBackup: true } }
    const PickPicture = async () => {

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // You can also display the image using data:
                const image = { uri: 'data:image/jpeg;base64,' + response.data };
                setPicture(image);
                setState({
                    ...state,
                    profilePicture: image,
                });
            }
        });


    }

    useEffect(() => {
        setState({ ...state, userId: user.uid, phoneNumber: user.phoneNumber });

    }, [])



    return (
        <>
            <StatusBar barStyle="dark-content" />
            { !done ? <UserConsumer>
                {(value) => {

                    return <ImageBackground source={bg} style={{ flex: 1 }}>

                        <View style={styles.main} >

                            <View style={{ width: `${100}%`, alignItems: "center", marginTop: `${28}%` }}>
                                <View style={styles.profilepicker}>
                                    <Image style={styles.profilePicture} source={picture} />
                                    <Icon name="camera" style={{ position: "absolute", bottom: 6, right: 4 }} size={20} color="white" onPress={() => {
                                        PickPicture();

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
                : <Home />
            }

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