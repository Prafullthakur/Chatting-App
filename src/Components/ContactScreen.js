import React, { useEffect, useState } from 'react';

import {
    StatusBar,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    PermissionsAndroid,

} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomBar from './BottomBar';
import Contacts from 'react-native-contacts';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';

const ContactScreen = ({ navigation }) => {

    const [active, setActive] = useState('contact');
    const [contacts, setContacts] = useState([]);

    const getList = () => {
        let contact = [];

        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                title: 'Contacts',
                message: 'This app would like to view your contacts.'
            }
        ).then(() => {
            Contacts.getAll((err, list) => {
                if (err) {
                    console.log('some error happended ' + err);
                } else {

                    list.map((cont) => (
                        cont.phoneNumbers.map((co) => {
                            contact.push(co.number)
                        })


                    ))

                    setContacts([...contacts, contact])
                    getUser(contact);
                }
            });


        });

    }

    const getUser = async (contact) => {
        const list = contact.slice(0, 10);
        console.log(list);
        const ref = firestore().collection('Users')
        ref.where('phoneNumber', 'in', ['+919027054342', '+917830717172'])
            .get()
            .then(querySnapshot => {
                console.log(querySnapshot._docs)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getList();

    }, [])

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
export default ContactScreen;