import React, { useEffect, useState } from 'react';

import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const BotttomBar = ({ navigation, active }) => {

    return (
        <View style={styles.bottom}>

            <Icon name="comments" style={{ paddingLeft: 3 }} size={25} color={active == 'home' ? 'skyblue' : 'black'} onPress={() => { navigation.navigate('HomeScreen') }} />
            <Icon name="image" style={{ paddingLeft: 3 }} size={25} color={active == 'status' ? 'skyblue' : 'black'} onPress={() => { navigation.navigate('Status') }} />
            <Icon name="phone" style={{ paddingLeft: 3 }} size={25} color={active == 'call' ? 'skyblue' : 'black'} onPress={() => { navigation.navigate('CallScreen') }} />
            <Icon name="address-book" style={{ paddingLeft: 3 }} size={25} color={active == 'contact' ? 'skyblue' : 'black'} onPress={() => { navigation.navigate('Contact') }} />
        </View>
    );
};
const styles = StyleSheet.create({
    bottom: {
        position: "absolute",
        bottom: 0,
        alignItems: "center",
        flexDirection: "row",
        width: `${100}%`,
        height: 40,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: "space-around"
    },
});
export default BotttomBar;