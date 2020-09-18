import React, { useEffect, useState, useContext } from 'react';

import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
} from 'react-native';
import { UserConsumer } from '../Context/UserContext';

const HomeScreen = () => {

    const [user, setUser] = useState(null);

    // const userId = useContext(UserConsumer);


    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView>
                <UserConsumer>
                    {value => <Text >{value}</Text>}
                </UserConsumer>

            </SafeAreaView>
        </>
    );
};

export default HomeScreen;