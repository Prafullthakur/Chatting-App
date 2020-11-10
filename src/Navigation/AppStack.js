import React, { useEffect, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import database from '@react-native-firebase/database';
import { UserConsumer } from '../Context/UserContext';
// Screens
import HomeScreen from '../Components/HomeScreen';
import ProfileUpdate from "../Components/ProfileUpdate";
import StatusScreen from '../Components/StatusScreen';
import CallScreen from '../Components/CallScreen';
import ContactScreen from '../Components/ContactScreen';
import DMScreen from '../Components/DMScreen';
import SettingScreen from '../Components/SettingScreen';
import AboutScreen from '../Components/AboutScreen';
// Application Stack
const App = createStackNavigator();

const AppStack = () => {

    return (
        <>
            <App.Navigator initialRouteName="HomeScreen" headerMode="none">
                <App.Screen name="HomeScreen" component={HomeScreen} />
                <App.Screen name="ProfileUpdate" component={ProfileUpdate} />
                <App.Screen name="Status" component={StatusScreen} />
                <App.Screen name="CallScreen" component={CallScreen} />
                <App.Screen name="Contact" component={ContactScreen} />
                <App.Screen name='DMScreen' component={DMScreen} />
                <App.Screen name='AboutScreen' component={AboutScreen} />
                <App.Screen name='SettingScreen' component={SettingScreen} />
            </App.Navigator>
        </>
    )
};

export default AppStack;