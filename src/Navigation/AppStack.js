import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from '../Components/HomeScreen';
import ProfileSetting from "../AuthScreens/ProfileSetting";
import StatusScreen from '../Components/StatusScreen';
import CallScreen from '../Components/CallScreen';
import ContactScreen from '../Components/ContactScreen';

// Authentication Stack
const App = createStackNavigator();

const AppStack = () => (

    <App.Navigator initialRouteName="HomeScreen" headerMode="none">
        <App.Screen name="HomeScreen" component={HomeScreen} />
        <App.Screen name="ProfileSetting" component={ProfileSetting} />
        <App.Screen name="Status" component={StatusScreen} />
        <App.Screen name="CallScreen" component={CallScreen} />
        <App.Screen name="Contact" component={ContactScreen} />

    </App.Navigator>
);

export default AppStack;