import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  DevSettings,
} from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    Axios.post('http://192.168.100.8:3333/api/api/login', {
      email: email,
      password: password,
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.token) {
          AsyncStorage.setItem('token', res.data.token);
          DevSettings.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>WarehouseAPP</Text>
      <Text style={styles.textContent}>
        Selamat Datang di Aplikasi Warehouse
      </Text>
      <Text style={styles.textContent}>Silahkan Login</Text>
      <TextInput
        style={styles.inputBox}
        placeholder="Email ..."
        placeholderTextColor="#fff"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.inputBox}
        placeholder="Password ..."
        placeholderTextColor="#fff"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.buttonWrapper} onPress={login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#455a64',
  },
  textTitle: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 40,
    marginBottom: 20,
  },
  textContent: {
    fontStyle: 'italic',
    color: 'white',
    fontSize: 12,
    marginBottom: 10,
  },
  inputBox: {
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255,255,0.2)',
    color: '#fff',
    borderRadius: 25,
    paddingLeft: 20,
    marginVertical: 10,
  },
  buttonWrapper: {
    backgroundColor: '#1c313a',
    justifyContent: 'center',
    borderRadius: 25,
    width: '80%',
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
