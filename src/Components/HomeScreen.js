import React, { useEffect, useState, useContext } from 'react';
import {
    SafeAreaView,
    TextInput,
    View,
    Text,
    Image,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { UserConsumer } from '../Context/UserContext';
import AsyncStorage from '@react-native-community/async-storage';
import BottomBar from './BottomBar';

const HomeScreen = () => {

    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [contacts, setContacts] = useState([]);
    const usr = useContext(UserConsumer);
    const [constactList, setContactList] = useState([]);
    const [image, setImage] = useState(null);

    const [search, setSearch] = useState(null);
    const [active, setActive] = useState('home');

    const [DATA, setData] = useState([
        {
            id: '',
            title: '',
            profilePicture: '',
            message: 'Hey, Call me urgent !',
            time: '4:50PM',
            messageCount: 2,
        },

    ]);

    const [menu, setMenu] = useState(null);

    const setMenuRef = ref => {
        setMenu(ref);
    };

    const hideMenu = () => {
        menu.hide();
    };

    const showMenu = () => {
        menu.show();
    };

    const Item = ({ title, message, time, messageCount, profilePicture }) => (
        <View style={styles.item}>
            <View style={{ flexDirection: "row" }}>
                <Image source={profilePicture} style={styles.messagePicture} />
                <View style={styles.intro}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.newMessage}>{message}</Text>
                </View>
            </View>
            <View style={styles.time}>
                <Text style={styles.messageTime}>{time}</Text>
                <View style={{
                    height: 17,
                    width: 17,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "skyblue",
                    borderRadius: 30,
                    marginTop: 4,
                }}>
                    <Text style={styles.messageCount}>{messageCount}</Text>
                </View>
            </View>
        </View>
    );

    const renderItem = ({ item }) => (
        <Item title={item.title} message={item.message} time={item.time} messageCount={item.messageCount} profilePicture={item.profilePicture} />
    );

    const getUser = async () => {
        firestore()
            .collection('Users')
            .doc(usr.uid)
            .get()
            .then((data) => {
                setUser(data._data);
                AsyncStorage.setItem(
                    'profilePicture',
                    JSON.stringify(data._data.profilePicture)
                );
            })
            .catch(err => {
                console.log(err);
            });
    }

    const getContacts = async () => {
        let userNumber = null;
        let mainuserNumber = null;
        mainuserNumber = usr.phoneNumber.split('+91');
        mainuserNumber = parseInt(mainuserNumber[1]);

        try {
            let users = await AsyncStorage.getItem('users');
            let userParsed = JSON.parse(users);
            setContacts(userParsed);
            userParsed.map((number) => (
                userNumber = number.phoneNumber.split('+91'),
                userNumber = parseInt(userNumber[1]),
                getChatList(userNumber + mainuserNumber, number.phoneNumber)
            ))
        } catch (error) {
            console.log(error)

        }
    }


    const getChatList = (collectionID, userNumber) => {
        let path = collectionID.toString();
        let allmessages = [];
        firestore().collection(path)
            .get()
            .then((data) => {
                // data._docs.map((data) => (
                //     data._data.createdAt = new Date(data._data.createdAt._seconds * 1000).toUTCString(),
                //     allmessages.push(data._data),
                //     setMessages(allmessages)
                contacts.map((data) => (
                    userNumber === data.phoneNumber ? setData([{ ...DATA, id: data.uid, title: data.name, profilePicture: data.profilePicture }]) : console.log("not working")
                ))


            })
            .catch((error) => { alert("An error occured!"), console.log(error) });

    }

    useEffect(() => {
        getUser();
        getContacts();
    }, []);

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: "black",
            }}>
                {
                    user ? DATA ?
                        <>
                            <View style={styles.main}>
                                <View style={styles.inner}>
                                    <View style={styles.profile}>
                                        <View style={styles.profileContent}>
                                            <Image source={user.profilePicture} style={styles.profilePicture} />
                                        </View>
                                        <Text style={styles.userName}>MeChat</Text>
                                        <View>
                                            <Menu
                                                style={styles.menu}
                                                ref={setMenuRef}
                                                button={<TouchableOpacity style={styles.menuDropdown} onPress={() => showMenu()}>
                                                    <Icon name="ellipsis-v" size={20} color="white" />
                                                </TouchableOpacity>}
                                            >
                                                <MenuItem onPress={() => { navigation.navigate('ProfileUpdate'); hideMenu() }}>Profile</MenuItem>
                                                <MenuItem onPress={() => { navigation.navigate('SettingScreen'); hideMenu() }}>Setting</MenuItem>
                                                <MenuItem onPress={() => { navigation.navigate('AboutScreen'); hideMenu() }}>About</MenuItem>

                                                <MenuDivider />

                                            </Menu>
                                        </View>
                                    </View>
                                    <View style={styles.seachBar}>
                                        <TextInput placeholder="Search" style={styles.search} onChangeText={(text) => { setSearch(text) }} />
                                        <Icon name="search" style={{ paddingLeft: 5 }} size={22} color="white" onPress={() => { navigation.navigate('Status') }} />
                                    </View>
                                    <FlatList
                                        data={DATA}
                                        renderItem={renderItem}
                                        keyExtractor={item => item.id} />
                                </View>
                                {console.log(DATA)}
                                <BottomBar navigation={navigation} active={active} />
                            </View>

                        </> : <View></View> : <View></View>
                }
            </SafeAreaView>
        </>
    );
};
const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "black",
    },
    menuDropdown: {
        alignItems: "center",
        width: 20,
    },
    // menu: {
    //     height: 200,
    //     width: 150,
    //     alignContent: "center",
    //     justifyContent: "space-between"
    // },
    inner: {
        flex: 1,
        paddingRight: 15,
        paddingLeft: 15,
    },
    profile: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 10,
        paddingBottom: 25,
    },
    profileContent: {
        flexDirection: "row",
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 30,

    },
    userName: {
        fontSize: 19,
        fontWeight: "bold",
        color: "white"
    },
    seachBar: {
        flexDirection: "row",
        alignItems: "center",

        paddingBottom: 20,
    },
    search: {
        width: `${92}%`,
        paddingLeft: 15,
        height: 35,
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
        color: "skyblue",
    },
    time: {
        justifyContent: "flex-end",
        alignItems: "center",
    },
    messageTime: {
        color: "white",
    },
    messageCount: {
        color: 'white',
    },

});
export default HomeScreen;