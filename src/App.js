/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import Login from './pages/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './pages/Home';
import MasukkanBarang from './pages/MasukkanBarang';
import AsyncStorage from '@react-native-community/async-storage';
import KeluarkanBarang from './pages/KeluarkanBarang';
import JumlahKeluar from './pages/KeluarkanBarang/JumlahKeluar';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('token', (error, result) => {
      if (result) {
        if (result) {
          setUserToken(result);
        }
      }
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#455a64" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar hidden />
      {userToken === null ? (
        <Login />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
            token={userToken}
          />
          <Stack.Screen
            name="MasukkanBarang"
            component={MasukkanBarang}
            options={{headerShown: false}}
            token={userToken}
          />
          <Stack.Screen
            name="KeluarkanBarang"
            component={KeluarkanBarang}
            options={{headerShown: false}}
            token={userToken}
          />
          <Stack.Screen
            name="JumlahKeluar"
            component={JumlahKeluar}
            options={{headerShown: false}}
            token={userToken}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default App;
