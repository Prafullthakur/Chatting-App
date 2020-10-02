import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from '../Context/UserContext';
import auth from '@react-native-firebase/auth';
// Stack
import AuthStack from './AuthStack';
//AppStack
import AppStack from './AppStack';

import LoadingStack from './LoadingStack';
// Loading Screen
//creating Main Stack
const MainStack = createStackNavigator();

const AppNavigator = () => {
    const [route, setRoute] = React.useState('Loading');
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        return auth().onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                //auth().signOut();
                //  user ? navigation.navigate('App') : navigation.navigate('Auth');
                setRoute('App');
            }
            else {
                console.log('no user found');
                setRoute('Auth');
            }
        });

    }, [])

    return (
        <NavigationContainer>
            <UserProvider value={user}>
                <MainStack.Navigator headerMode="none">
                    {
                        route === "Auth" ? <MainStack.Screen name="Auth" component={AuthStack} /> : route === "App" ? <MainStack.Screen name="App" component={AppStack} /> : <MainStack.Screen name="Loading" component={LoadingStack} />
                    }
                </MainStack.Navigator>
            </UserProvider>
        </NavigationContainer>
    )
};

export default AppNavigator;