import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from '../Components/HomeScreen';
import ProfileSetting from "../AuthScreens/ProfileSetting";

// Authentication Stack
const App = createStackNavigator();

const AppStack = () => (

    <App.Navigator initialRouteName="HomeScreen" headerMode="none">
        <App.Screen name="HomeScreen" component={HomeScreen} />
        <App.Screen name="ProfileSetting" component={ProfileSetting} />
    </App.Navigator>
);

export default AppStack;