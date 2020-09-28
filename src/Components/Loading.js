import React, { useEffect, useState } from 'react';

import {
    SafeAreaView,
    View,
    Text,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { UserProvider } from '../Context/UserContext';
import AuthScreen from "../AuthScreens/AuthScreen";
import HomeScreen from "../Components/HomeScreen";
import ProfileSetting from "../AuthScreens/ProfileSetting";

const Loading = ({ navigation }) => {
    const [first, setFirst] = useState(false);

    const [user, setUser] = useState(null);

    const handleFirst = () => {
        setFirst(true);
    }

    useEffect(() => {
        return auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                //auth().signOut();
                //  user ? navigation.navigate('App') : navigation.navigate('Auth');
            }
            else {
                console.log('no user found');
            }
        });

    }, [])

    return (

        <UserProvider value={user}>


            {
                user ? (first ? <ProfileSetting /> : <HomeScreen />) : (<AuthScreen handleFirst={handleFirst} />)
            }

        </UserProvider>
    );
};

export default Loading;