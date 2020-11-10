import React, { useEffect, useState } from 'react';

import {
    StatusBar,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    TextInput,
    PermissionsAndroid,
    FlatList,
    ActivityIndicator,
    Image,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomBar from './BottomBar';
import simpleContacts from 'react-native-simple-contacts';
import AsyncStorage from '@react-native-community/async-storage';

const ContactScreen = ({ navigation }) => {
    const [active, setActive] = useState('contact');
    const [contacts, setContacts] = useState([]);
    const [change, setChange] = useState([]);
    const [users, setUsers] = useState(null);
    const [count, setCount] = useState(null);
    const getList = () => {
        let contact = [];
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                title: 'Contacts',
                message: 'This app would like to view your contacts.'
            }
        ).then(() => {
            simpleContacts.getContacts().then((contacts) => {

                let contactsList = JSON.parse(contacts);
                contactsList.forEach(list => {

                    if (list.number.includes('+', 0)) {

                        contact.push(list.number.replace(/\s/g, ""));

                    } else {
                        let number = '+91' + list.number;
                        contact.push(number.replace(/\s/g, ""));
                    }
                    setContacts({ ...contacts, contact });
                });
                getUser(contact);
            })
        });

    }


    const getUser = async (contact) => {

        let users = [];
        const length = Math.floor(contact.length / 10);
        const lastValue = contact.length % 10;
        let counter = 1;
        let count = 0;
        const ref = firestore().collection('Users');
        let numbers = [];
        while (contact.length) {
            numbers.push(contact.splice(0, 10));
        }

        numbers.forEach((numberData) => {
            ref.where('phoneNumber', 'in', numberData)
                .get()
                .then(data => {
                    data._docs.map((data) => (
                        count++,
                        users.push({ "name": data._data.name, "phoneNumber": data._data.phoneNumber, "profilePicture": data._data.profilePicture, "uid": data._data.userId }),
                        setLocal(users, count, counter, numbers.length)
                    ));

                })
                .catch((err) => {
                    console.log(err);
                });
            counter++
        })


    }

    const setLocal = async (users, count, counter, length) => {
        try {
            await AsyncStorage.setItem(
                'users',
                JSON.stringify(users)
            );

            await AsyncStorage.setItem(
                'count',
                JSON.stringify(count)
            );

            counter > length ? getFromLocal() : console.log("Not Working");

        } catch (error) {
            // Error saving data

        }
    }

    const getFromLocal = async () => {
        const user = await AsyncStorage.getItem('users');
        const parsedUser = JSON.parse(user);
        setUsers(parsedUser);
        parsedUser == null ? getList() : "";
        const count = await AsyncStorage.getItem('count');
        setCount(count);
    }

    const Item = ({ name, profilePicture, phoneNumber, uid }) => (
        <TouchableOpacity onPress={() => {
            navigation.navigate('DMScreen', {
                name: name,
                profilePicture: profilePicture,
                uid: uid,
                phoneNumber: phoneNumber,
            })
        }}>
            <View style={styles.item}>
                <View style={{ flexDirection: "row" }}>
                    <Image source={profilePicture} style={styles.messagePicture} />
                    <View style={styles.intro}>
                        <Text style={styles.title}>{name}</Text>
                        <Text style={styles.newMessage}>{phoneNumber}</Text>
                    </View>
                </View>

            </View>
        </TouchableOpacity>

    );

    const renderItem = ({ item }) => (
        <Item name={item.name} profilePicture={item.profilePicture} phoneNumber={item.phoneNumber} uid={item.uid} />
    );

    useEffect(() => {
        getFromLocal();
    }, [])


    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: "black",
            }}>
                <>
                    <View style={styles.main}>
                        <View style={styles.inner}>
                            <View style={styles.head}>
                                <View style={styles.headinner}>
                                    <Text style={styles.mainHead}>Select Contact</Text>
                                    <Text style={styles.secondHead}>{count} contacts</Text>
                                </View>
                                <Icon name="retweet" style={{ paddingLeft: 5 }} size={22} color="white" onPress={() => {
                                    getList(),
                                        setUsers(null)
                                    setCount(0)
                                }} />
                            </View>
                            <View style={styles.seachBar}>
                                <TextInput placeholder="Search" style={styles.search} onChangeText={(text) => { setSearch(text) }} />
                                <Icon name="search" style={{ paddingLeft: 5 }} size={22} color="white" />
                            </View>
                            {users ? <>
                                <FlatList
                                    data={users}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.uid} />
                            </> : <View style={styles.loadingBG}>
                                    <ActivityIndicator
                                        animating={true}
                                        color="white"
                                        size="large"
                                        style={{ margin: 15 }}
                                    />
                                </View>}
                        </View>
                    </View>
                    <BottomBar navigation={navigation} active={active} />

                </>
            </SafeAreaView>


        </>
    );
};
const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "black",
    },
    inner: {
        flex: 1,
        paddingRight: 15,
        paddingLeft: 15,
    },
    loadingBG: {
        flex: 0.8,
        alignItems: "center",
        justifyContent: "center",
    },
    head: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    },
    headinner: {
        flexDirection: "column",
    },
    mainHead: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
    },
    secondHead: {
        fontSize: 13,
        color: "white"
    },
    seachBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 15,
        paddingBottom: 20,
    },
    search: {
        width: `${92}%`,
        paddingLeft: 15,
        height: 40,
        borderRadius: 18,
        backgroundColor: "white",

    },
    item: {
        width: `${100}%`,
        paddingTop: 10,
        paddingBottom: 10,
        marginVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 18,
        color: "white",
    },
    messagePicture: {
        width: 50,
        height: 50,
        borderRadius: 30,

    },
    intro: {
        paddingLeft: 10,
    },
    newMessage: {
        paddingTop: 2,
        fontSize: 13,
        color: "white",
    },
});
export default ContactScreen;