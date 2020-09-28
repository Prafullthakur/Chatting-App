import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from '../Context/UserContext';
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
        <UserProvider>
            <MainStack.Navigator initialRouteName="Loading" headerMode="none">
                <MainStack.Screen name="Loading" component={Loading} />
                <MainStack.Screen name="Auth" component={AuthStack} />
                <MainStack.Screen name="App" component={AppStack} />
            </MainStack.Navigator>
        </UserProvider>


    </NavigationContainer>
);

export default AppNavigator;