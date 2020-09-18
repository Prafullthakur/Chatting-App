import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Stack
import AuthStack from './AuthStack';
//AppStack
import AppStack from './AppStack';
// Loading Screen
import Loading from '../Components/Loading';
//creating Main Stack
const MainStack = createStackNavigator();

const AppNavigator = () => (
    <NavigationContainer>

        <MainStack.Navigator initialRouteName="Loading" headerMode="none">
            <MainStack.Screen name="Loading" component={Loading} />
            <MainStack.Screen name="Auth" component={AuthStack} />
            <MainStack.Screen name="App" component={AppStack} />
        </MainStack.Navigator>

    </NavigationContainer>
);

export default AppNavigator;