import React, { useEffect, useState } from 'react';

import {
    SafeAreaView,
    View,
    Text,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { UserProvider } from '../Context/UserContext';
import App from "../Navigation/AppStack";
import Auth from "../Navigation/AuthStack";
const Loading = ({ navigation }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        return auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user.uid);
                console.log(user.uid);
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
                user ? <App /> : <Auth />
            }

        </UserProvider>
    );
};

export default Loading;