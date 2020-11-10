import React, { useEffect, useContext, useState, useCallback } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Voximplant } from 'react-native-voximplant';
import FilePickerManager from 'react-native-file-picker';
import RNFS from 'react-native-fs';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import { UserConsumer } from '../Context/UserContext';
import { Time } from 'react-native-gifted-chat';
import { set } from 'react-native-reanimated';
import { GiftedChat } from 'react-native-gifted-chat';

export default function DMScreen({ route }) {
    const usr = useContext(UserConsumer);
    const [name, setName] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [uid, setUid] = useState(null);
    const [sum, setSum] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [message, setMessage] = useState(null);
    const [messages, setMessages] = useState([]);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    }, [])


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
        const path = `${fileType}/${name}/${Date.now()}.${fileExtension}`;
        const response = await fetch(uri);
        const file = await response.blob();
        const upload = storage().ref(path).put(file);
        upload.then((data) => {
            let url = `https://firebasestorage.googleapis.com/v0/b/mechat-b5d9f.appspot.com/o/${path}?alt=media`;
            setMessage({ ...message, file: url });
            uploadMessages();
        })
            .catch((err) => {
                console.log(err);
            })

    }

    const uploadMessages = (message) => {
        let path = sum.toString();
        database()
            .ref(`Chats/${path}/`)
            .push(message)
            .then(() => console.log('Data set.'))
            .catch((err) => {
                console.log(err);
            });

    }
    const getMessages = (sum) => {

        let path = sum.toString();
        let allmessages = [];
        let sortedChat = [];
        let times = [];
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        database().ref(`Chats/${path}/`).on('child_added', function (snapdata) {

            Object.values(snapdata).map((data) => {
                if (data.value !== undefined)
                    allmessages.unshift(data.value)
            })

            setMessages(allmessages)


            //     times.sort(function (a, b) {
            //         let newA = a.split(' ');
            //         let newB = b.split(' ');
            //         return newB[1] - newA[1];
            //     });

            //     times.sort(function (a, b) {
            //         let newA = a.split(' ');
            //         let newB = b.split(' ');
            //         let dateA = newA[2];
            //         let dateB = newB[2];
            //         return months.indexOf(dateB) - months.indexOf(dateA);
            //     });

            //     times.sort(function (a, b) {
            //         let newA = a.split(' ');
            //         let newB = b.split(' ');
            //         let dateA = newA[3];
            //         let dateB = newB[3];
            //         return dateB - dateA;
            //     });

            //     times.map((data) => (
            //         allmessages.map((time) => (
            //             data === time.createdAt ? sortedChat.push(time) : ''
            //         )),
            //         setMessages(sortedChat)
            //     ));


        })

    }

    useEffect(() => {
        if (route.params) {
            // var currentdate = new Date();
            const { name, profilePicture, uid, phoneNumber } = route.params;
            setName(name);
            setProfilePicture(profilePicture);
            setUid(uid);
            setPhoneNumber(phoneNumber);
            // setMessage({
            //     ...message, from: uid, createdAt: currentdate.getDate() + "/"
            //         + (currentdate.getMonth() + 1) + "/"
            //         + currentdate.getFullYear() + "@"
            //         + currentdate.getHours() + ":"
            //         + currentdate.getMinutes() + ":"
            //         + currentdate.getSeconds(),
            // });
            let reciver = phoneNumber.split('+91');
            let sender = usr.phoneNumber.split('+91');
            let newRs = parseInt(reciver[1]);
            let newSs = parseInt(sender[1]);
            setSum(newRs + newSs);
            getMessages(newRs + newSs);
        }
    }, [route.params])

    return (
        <View style={styles.main}>
            <View style={styles.head}>
                <View style={styles.profileContent}>
                    <Image style={styles.profilePicture} source={profilePicture} />
                    <Text style={styles.profileName}>{name}</Text>
                </View>
                <View style={styles.callContent}>
                    <Icon size={23} name="phone" color="black" />
                    <Icon size={23} name="camera" color="black" />
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <GiftedChat style={{ color: "white" }}
                    messages={messages}
                    onSend={messages => {
                        messages[0].createdAt = Date.now()

                        onSend(messages)
                        uploadMessages(messages[0]);
                    }}
                    user={{
                        _id: usr.uid,
                        avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ficonscout.com%2Ficon%2Favatar-380&psig=AOvVaw3oNyTYsz3H5txhlbjMjloC&ust=1602842517955000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKDahuirtuwCFQAAAAAdAAAAABAD',
                    }}
                    showUserAvatar={true}
                />
            </View>
            {/* <View style={styles.bottom}>
                <View style={styles.messageInput}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 18,
                        backgroundColor: "white",
                    }}>
                        <Icon name="file" size={20} color="#000" onPress={() => { getFiles() }} />
                        <TextInput placeholder="Type a message" style={styles.search} onChangeText={(text) => { setMessage({ ...message, message: text }) }} />
                    </View>
                    <Icon name="send-o" size={25} style={{ paddingLeft: 5 }} color="white" onPress={() => { uploadMessages() }} />
                </View>
            </View> */}
        </View>
    )
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "black",
    },
    head: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
        width: `${100}%`,
        height: 55,
        backgroundColor: "rgba(255,255,255,0.8)",
    },
    profileContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 30,
    },
    profileName: {
        paddingLeft: 10,
        fontSize: 19,
        fontWeight: "bold",
        color: "black"
    },
    callContent: {
        flexDirection: "row",
        alignItems: "center",
        width: `${18}%`,
        justifyContent: "space-between",
    },
    search: {
        width: `${84}%`,
        paddingLeft: 15,
        borderRadius: 18,
        backgroundColor: "white",
    },
    bottom: {
        position: "absolute",
        bottom: 0,
        alignItems: "center",
        width: `${100}%`,
        height: 40,
        justifyContent: "space-around"
    },
    messageInput: {
        width: `${100}%`,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
})

