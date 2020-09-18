import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import AuthScreen from '../AuthScreens/AuthScreen';
import ProfileSetting from "../AuthScreens/ProfileSetting";
// Authentication Stack
const Auth = createStackNavigator();

const AuthStack = () => (
    <Auth.Navigator initialRouteName="AuthScreen" headerMode="none">
        <Auth.Screen name="AuthScreen" component={AuthScreen} />
        <Auth.Screen name="ProfileSetting" component={ProfileSetting} />
    </Auth.Navigator>
);

export default AuthStack;