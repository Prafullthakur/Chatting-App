import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from '../Components/HomeScreen';


// Authentication Stack
const Auth = createStackNavigator();

const AppStack = () => (
    <Auth.Navigator initialRouteName="HomeScreen" headerMode="none">
        <Auth.Screen name="HomeScreen" component={HomeScreen} />

    </Auth.Navigator>
);

export default AppStack;