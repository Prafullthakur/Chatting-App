import React, { useEffect, useState } from 'react';

import {
    StatusBar,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TextInput,
    PermissionsAndroid,
    FlatList,
    Image,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomBar from './BottomBar';
import Contacts from 'react-native-contacts';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';
import AsyncStorage from '@react-native-community/async-storage';

const ContactScreen = ({ navigation }) => {

    const [active, setActive] = useState('contact');
    const [contacts, setContacts] = useState([]);
    const [users, setUsers] = useState({
        name: "",
        phoneNumber: "",
        profilePicture: "",
        uid: "",
    });
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
            Contacts.getAll((err, list) => {
                if (err) {
                    console.log('some error happended ' + err);
                } else {

                    list.map((cont) => (
                        cont.phoneNumbers.map((co) => {
                            if (co.number.includes('+', 0)) {
                                contact.push(co.number);

                            } else {
                                let number = '+91' + co.number;
                                contact.push(number);
                            }
                        })
                    ))

                    setContacts({ ...contacts, contact });

                    getUser(contact);
                }
            });


        });

    }

    const CheckConnectivity = (users, count) => {
        // For Android devices
        if (Platform.OS === "android") {
            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    setLocal(users, count);
                }
            });
        } else {
            // For iOS devices
            NetInfo.isConnected.addEventListener(
                "connectionChange",
                this.handleFirstConnectivityChange
            );
        }
    };


    const getUser = async (contact) => {
        let users = [];
        const length = Math.floor(contact.length / 10);
        const lastValue = contact.length % 10;
        let counter = 1;
        let count = 0;
        for (var i = 1; i <= length; i++) {
            var numbers = [];
            if (counter !== length) {
                for (var y = (counter - 1) * 10; y < ((counter - 1) * 10) + 10; y++) {
                    numbers.push(contact[y]);
                }
            } else if (counter === length) {
                for (var y = counter * 10; y < (counter * 10) + lastValue; y++) {
                    numbers.push(contact[y]);
                }

            }
            counter++;

            const ref = firestore().collection('Users')
            ref.where('phoneNumber', 'in', numbers)
                .get()
                .then(querySnapshot => {
                    querySnapshot._docs.map((data) => (
                        count++,
                        users.push({ "name": data._data.name, "phoneNumber": data._data.phoneNumber, "profilePicture": data._data.profilePicture, "uid": data._data.userId }),
                        CheckConnectivity(users, count)
                    ))

                })
                .catch((err) => {
                    console.log(err);
                })


        }


    }

    const setLocal = async (users, count) => {
        try {
            await AsyncStorage.setItem(
                'users',
                JSON.stringify(users)
            );
            await AsyncStorage.setItem(
                'count',
                JSON.stringify(count)
            );
        } catch (error) {
            // Error saving data

        }
    }

    const getLocal = async () => {
        try {
            let user = await AsyncStorage.getItem(
                'users',
            );
            let counter = await AsyncStorage.getItem(
                'count',
            );

            setUsers(JSON.parse(user));
            setCount(JSON.parse(counter));
        } catch (error) {
            // Error saving data
        }
    }

    const Item = ({ name, profilePicture, phoneNumber }) => (
        <View style={styles.item}>
            <View style={{ flexDirection: "row" }}>
                <Image source={profilePicture} style={styles.messagePicture} />
                <View style={styles.intro}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.newMessage}>{phoneNumber}</Text>
                </View>
            </View>

        </View>
    );

    const renderItem = ({ item }) => (
        <Item name={item.name} profilePicture={item.profilePicture} phoneNumber={item.phoneNumber} />
    );

    useEffect(() => {
        getList();
        getLocal();
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
                                <Text style={styles.mainHead}>Select Contact</Text>
                                <Text style={styles.secondHead}>{count} contacts</Text>
                            </View>
                            <View style={styles.seachBar}>
                                <TextInput placeholder="Search" style={styles.search} onChangeText={(text) => { setSearch(text) }} />
                                <Icon name="search" style={{ paddingLeft: 5 }} size={22} color="white" />
                            </View>
                            <FlatList
                                data={users}
                                renderItem={renderItem}
                                keyExtractor={item => item.uid} />

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