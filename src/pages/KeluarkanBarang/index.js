import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, DevSettings, Alert} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {RNCamera} from 'react-native-camera';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {url} from '../../service/config';

const KeluarkanBarang = ({navigation, route}) => {
  const [rakIsis, setRakIsis] = useState([]);

  const [rakId, setRakId] = useState('');
  const [barangId, setBarangId] = useState('');

  const [barcodeRak, setBarcodeRak] = useState(true);

  const token = {Authorization: 'Bearer ' + route.params.token};

  const scanRak = (e) => {
    // console.log(e);
    setRakId(e.data);
    setBarcodeRak(false);
  };

  const scanBarang = (e) => {
    setBarangId(e.data);
    setBarcodeRak(true);
    // if (barangId !== '' && rakId !== '') {
    //   Axios.get(`url/rakterpakai/${rakId}/${barangId}`, {
    //     headers: token,
    //   })
    //     .then((res) => {
    //       console.log(res.data);
    //       setRakIsis(res.data);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
  };

  const cekItem = () => {
    console.log('Oke');
    Axios.get(`${url}/rakterpakai/${rakId}/${barangId}`, {
      headers: token,
    })
      .then((res) => {
        setRakIsis(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Qcode = (props) => {
    return (
      <View style={styles.containerScanner}>
        <Text style={styles.textTitle}>Scan Barcode {props.nama}</Text>
        <QRCodeScanner
          showMarker
          cameraStyle={styles.scanner}
          onRead={props.scan}
        />
      </View>
    );
  };

  const Btn = (props) => {
    return (
      <TouchableOpacity style={styles.buttonWrapper} onPress={props.tekan}>
        <Text style={styles.buttonText}>{props.nama}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonLayout}>
        <Btn nama="Rak" tekan={() => setBarcodeRak(true)} />
        <Btn nama="Barang" tekan={() => setBarcodeRak(false)} />
      </View>
      {barcodeRak ? (
        <Qcode nama="Rak" scan={scanRak} />
      ) : (
        <Qcode nama="Barang" scan={scanBarang} />
      )}
      <View>
        {barangId !== '' && rakId !== '' && (
          <Text style={styles.textItem} onLayout={cekItem}>
            | Rak ID: {rakId} | : | Barang ID: {barangId} |
          </Text>
        )}
      </View>
      <View style={styles.buttonLayoutBawah}>
        {/* <ScrollView style={styles.scrollLayoutBawah}> */}
        {rakIsis &&
          rakIsis.map((rakisi) => {
            return (
              <TouchableOpacity
                key={rakisi.id}
                style={styles.buttonIsiRak}
                onPress={() =>
                  navigation.navigate('JumlahKeluar', {
                    token: token,
                    id: rakisi.id,
                  })
                }>
                <Text style={styles.buttonText}>
                  {rakisi.barang.produk}||{rakisi.rak.nama}||{rakisi.stok}
                </Text>
                <Text style={styles.buttonText}>
                  Tanggal Masuk : {rakisi.created_at}
                </Text>
              </TouchableOpacity>
            );
          })}
        {/* </ScrollView> */}
      </View>
    </View>
  );
};

export default KeluarkanBarang;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#455a64',
  },
  containerScanner: {
    // flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#455a64',
    maxHeight: 500,
  },
  textTitle: {
    marginTop: 30,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 40,
    // marginBottom: 20,
  },
  textItemTitle: {
    marginTop: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    // marginBottom: 20,
  },
  textItem: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    // marginBottom: 20,
  },
  scanner: {
    // height: 200,
    width: 200,
    alignSelf: 'center',
    // justifyContent: 'center',
  },
  buttonLayout: {
    flexDirection: 'row',
  },
  buttonLayoutBawah: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  scrollLayoutBawah: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    backgroundColor: '#1c313a',
    justifyContent: 'center',
    borderRadius: 25,
    width: 150,
    height: 50,
    marginHorizontal: 10,
  },
  buttonIsiRak: {
    backgroundColor: '#1c313a',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 25,
    width: 150,
    height: 70,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
