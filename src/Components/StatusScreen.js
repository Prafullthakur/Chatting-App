import React, { useEffect, useState, useContext } from 'react';

import {
    StatusBar,
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import storage from '@react-native-firebase/storage';
import FilePickerManager from 'react-native-file-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { UserConsumer } from '../Context/UserContext';
import BottomBar from './BottomBar';
import RNFS from 'react-native-fs';
import database from '@react-native-firebase/database';

const StatusScreen = ({ navigation }) => {
    const usr = useContext(UserConsumer);
    const [active, setActive] = useState('status');
    const [picture, setPicture] = useState(null);

    const getFiles = async () => {
        let url = null;
        FilePickerManager.showFilePicker(null, async (response) => {
            url = response.uri;
            if (response.didCancel) {
                console.log('User cancelled file picker');
            }
            else if (response.error) {
                console.log('FilePickerManager Error: ', response.error);
            }
            if (url.startsWith('content://')) {
                const uriComponents = url.split('/')
                const fileNameAndExtension = uriComponents[uriComponents.length - 1]
                const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`
                await RNFS.copyFile(url, destPath)
                uploadFiles(`file://${destPath}`, response.type);
            } else {
                console.log('not working')
            }
        });
    }

    const uploadFiles = async (uri, type) => {
        const uriComponents = type.split('/');
        const fileExtension = uriComponents[uriComponents.length - 1];
        const fileType = uriComponents[uriComponents.length - 2];
        var name = Date.now();
        const path = `${fileType}/${usr.uid}/${name}.${fileExtension}`;
        const response = await fetch(uri);
        const file = await response.blob();
        const upload = storage().ref(path).put(file);
        upload.then((data) => {
            let url = `https://firebasestorage.googleapis.com/v0/b/mechat-b5d9f.appspot.com/o/${fileType}%2F${usr.uid}%2F${name}.${fileExtension}?alt=media`;
            uploadStatus(url);
        })
            .catch((err) => {
                console.log(err);
            })

    }
    const uploadStatus = (url) => {

        database()
            .ref(`Status/${usr.uid}/`)
            .push(url)
            .then(() => console.log('Data set.'))
            .catch((err) => {
                console.log(err);
            });

    }

    const getStatus = () => {

        database().ref(`Status/${usr.uid}/`).on('child_added', function (snapdata) {
            setPicture({ snapdata });
            // Object.values(snapdata).map((data) => {
            //     if (data.value !== undefined)
            //         allmessages.unshift(data.value)
            // })

            // setMessages(allmessages)


        })

    }

    const getFromLocal = async () => {
        const profilepicture = await AsyncStorage.getItem('profilePicture');
        setPicture(JSON.parse(profilepicture));

    }

    useEffect(() => {
        getFromLocal();
        getStatus();
    }, [])

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: "black",
            }}>
                <>
                    <View style={styles.container}>
                        <View style={styles.addStatus}>
                            <View style={styles.profilepicker}>
                                <Image style={styles.profilePicture} source={picture} />
                                <Icon name="plus-circle" style={{ position: "absolute", bottom: 0, right: 0 }} size={22} color="white" onPress={() => {
                                    getFiles();

                                }} />
                            </View>
                        </View>
                    </View>
                    <BottomBar navigation={navigation} active={active} />
                </>
            </SafeAreaView>


        </>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profilepicker: {
        width: 65,
        height: 65,
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
});
export default StatusScreen;