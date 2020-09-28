import React, { useEffect, useState } from 'react';

import {
    StatusBar,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import BottomBar from './BottomBar';

const StatusScreen = ({ navigation }) => {

    const [active, setActive] = useState('status');

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: "black",
            }}>
                <>
                    <BottomBar navigation={navigation} active={active} />
                </>
            </SafeAreaView>


        </>
    );
};
const styles = StyleSheet.create({

});
export default StatusScreen;