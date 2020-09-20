/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

import {
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';


import AppNavigator from './src/Navigation/AppNavigator';
import ProfileSetting from './src/AuthScreens/ProfileSetting';

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
      <SafeAreaView style={{ flex: 1, }}>
        <AppNavigator />
      </SafeAreaView>
    </>
  );
};

export default App;
