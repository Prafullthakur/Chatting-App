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
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserConsumer } from '../Context/UserContext';
import BottomBar from './BottomBar';
import StatusScreen from './StatusScreen';
import CallScreen from './CallScreen';
import ContactScreen from './ContactScreen';
const HomeScreen = ({ navigation }) => {

    const [user, setUser] = useState(null);

    const usr = useContext(UserConsumer);

    const [image, setImage] = useState(null);

    const [search, setSearch] = useState(null);
    const [active, setActive] = useState('home');

    const DATA = [
        {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            title: 'First Item',
            message: 'Hey, Call me urgent !',
            time: '4:50PM',
            messageCount: 2,
        },
        {
            id: '3ac68afc-c605d3-a4f8-fbd91aa97f63',
            title: 'Second Item',
            message: 'How are you ?',
            time: '5:10PM',
            messageCount: 1,
        },
        {
            id: '58694a0f-371f-bd96-145571e29d72',
            title: 'Third Item',
            message: 'okay its alright',
            time: '3:00AM',
            messageCount: 1,
        },
        {
            id: '3ac68afc-c605-48d-fbd91aa97f63',
            title: 'Second Item',
            message: 'Are you working right now ?',
            time: '2:50PM',
            messageCount: 2,
        },
        {
            id: '58694a0f-3dabd96-145571e29d',
            title: 'Third Item',
            message: 'okay i understood',
            time: '1:00AM',
            messageCount: 3,
        },
        {
            id: '3ac65-48d3-a4f8-fbd91aa97f3',
            title: 'Second Item',
            message: 'bye !!!',
            time: '5:00AM',
            messageCount: 6,
        },
        {
            id: '58694a0f-3da1-471f-bd1e2972',
            title: 'Third Item',
            message: 'Go to hell',
            time: '12:00PM',
            messageCount: 3,
        },
    ];
    const Item = ({ title, message, time, messageCount }) => (
        <View style={styles.item}>
            <View style={{ flexDirection: "row" }}>
                <Image source={user.profilePicture} style={styles.messagePicture} />
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
        <Item title={item.title} message={item.message} time={item.time} messageCount={item.messageCount} />
    );

    const getUser = async () => {
        firestore()
            .collection('Users')
            .doc(usr.uid)
            .get()
            .then((data) => {
                setUser(data._data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: "black",
            }}>
                <ScrollView
                    horizontal={true}
                    contentContainerStyle={{ width: `${400}%` }}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={200}
                    decelerationRate="fast"
                    pagingEnabled>
                    {
                        user ?
                            <>
                                <View style={styles.main}>
                                    <View style={styles.inner}>
                                        <View style={styles.profile}>
                                            <View style={styles.profileContent}>
                                                <Image source={user.profilePicture} style={styles.profilePicture} />
                                            </View>
                                            <Text style={styles.userName}>MeChat</Text>
                                            <View>
                                                <Icon name="ellipsis-v" size={20} color="white" />
                                            </View>
                                        </View>
                                        <View style={styles.seachBar}>
                                            <TextInput placeholder="Search" style={styles.search} onChangeText={(text) => { setSearch(text) }} />
                                            <Icon name="search" style={{ paddingLeft: 5 }} size={22} color="white" />
                                        </View>
                                        <FlatList
                                            data={DATA}
                                            renderItem={renderItem}
                                            keyExtractor={item => item.id} />
                                    </View>

                                    <BottomBar navigation={navigation} active={active} />
                                </View>

                            </> : <View></View>
                    }
                    <StatusScreen />
                    <CallScreen />
                    <ContactScreen />
                </ScrollView>

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