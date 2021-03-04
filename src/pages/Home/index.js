import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, DevSettings, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import {url} from '../../service/config';

const Home = ({navigation}) => {
  const [tokenUser, setTokenUser] = useState();
  const [user, setUser] = useState({});

  const token = {Authorization: 'Bearer ' + tokenUser};
  useEffect(() => {
    AsyncStorage.getItem('token', (error, result) => {
      if (result) {
        if (result) {
          setTokenUser(result);
        }
      }
    });
    checkUser();
  }, []);

  // console.log(url);
  const checkUser = () => {
    Axios.get(`${url}/api/api/profile`, {
      headers: token,
    })
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logout = () => {
    AsyncStorage.removeItem('token');
    console.log(AsyncStorage.getItem('token'));
    DevSettings.reload();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Hallo {user.username}</Text>
      <Text style={styles.textItem}>Silahkan pilih menu berikut:</Text>
      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() =>
          navigation.navigate('MasukkanBarang', {token: tokenUser})
        }>
        <Text style={styles.buttonText}>Masukkan Barang</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() =>
          navigation.navigate('KeluarkanBarang', {token: tokenUser})
        }>
        <Text style={styles.buttonText}>Keluarkan Barang</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonWrapper} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#455a64',
  },
  textTitle: {
    marginTop: 30,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 40,
    // marginBottom: 20,
  },
  textItem: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    // marginBottom: 20,
  },
  buttonWrapper: {
    backgroundColor: '#1c313a',
    justifyContent: 'center',
    borderRadius: 25,
    width: 200,
    height: 50,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
