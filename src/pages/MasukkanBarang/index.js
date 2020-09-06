import React, {useState} from 'react';
import {StyleSheet, Text, View, DevSettings, Alert} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RNCamera} from 'react-native-camera';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const MasukkanBarang = ({navigation, route}) => {
  const [rak, setRak] = useState({
    id: '',
    nama: '',
    stock_max: '',
  });
  const [barang, setBarang] = useState({
    id: '',
    produk: '',
    suplier_id: '',
    kategori_id: '',
    stock: '',
    deskripsi: '',
  });

  const [barcodeRak, setBarcodeRak] = useState(true);

  const token = {Authorization: 'Bearer ' + route.params.token};

  const scanRak = (e) => {
    // console.log(e);
    // setRak(e.data);
    // const token = route.params.token;
    Axios.get(`http://192.168.100.8:3333/rak/${e.data}`, {
      headers: token,
    })
      .then((res) => {
        console.log(res.data.id);
        setRak({
          id: res.data.id,
          nama: res.data.nama,
          stock_max: res.data.stock_max,
        });
        setBarcodeRak(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // Linking.openURL(e.data).catch((err) =>
    // Linking.openURL(
    //   `http://192.168.100.8:3333/rakAndro/${e.data}`,
    // ).catch((err) => console.error('An error occured', err));
  };

  const scanBarang = (e) => {
    Axios.get(`http://192.168.100.8:3333/barang/${e.data}`, {
      headers: token,
    })
      .then((res) => {
        console.log(res.data.id);
        setBarang({
          id: res.data.id,
          produk: res.data.produk,
          suplier_id: res.data.suplier_id,
          kategori_id: res.data.kategori_id,
          stock: res.data.stock,
          deskripsi: res.data.deskripsi,
        });
        setBarcodeRak(true);
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

  const simpanBarang = () => {
    if (rak.stock_max > 0 && barang.stock > 0) {
      // const stok = rak.stock_max - pilihBM.stock_bm;
      const currantStockRak = rak.stock_max - barang.stock;
      console.log(currantStockRak);
      if (currantStockRak < 0) {
        const stockfix = Math.abs(currantStockRak);
        console.log(stockfix);
        Axios.post(
          `http://192.168.100.8:3333/rak/${rak.id}`,
          {
            id: rak.id,
            nama: rak.nama,
            stock_max: 0,
          },
          {headers: token},
        )
          .then((res) => {
            console.log(res.data);
            // setrak(res.data)
          })
          .catch((err) => {
            if (err.response.status === 401) {
              AsyncStorage.removeItem('token');
              DevSettings.reload();
            }
            console.log(err);
          });
        Axios.post(
          `http://192.168.100.8:3333/barang/${barang.id}`,
          {
            id: barang.id,
            produk: barang.produk,
            suplier_id: barang.suplier_id,
            kategori_id: barang.kategori_id,
            stock: stockfix,
            deskripsi: barang.deskripsi,
          },
          {headers: token},
        )
          .then((res) => {
            console.log(res.data);
            // setPilihBM(res.data)
          })
          .catch((err) => {
            if (err.response.status === 401) {
              AsyncStorage.removeItem('token');
              DevSettings.reload();
            }
            console.log(err);
          });

        Axios.post(
          'http://192.168.100.8:3333/rakterpakai',
          {
            stock: barang.stock - stockfix,
            rak_id: rak.id,
            barang_id: barang.id,
          },
          {headers: token},
        )
          .then((res) => {
            console.log(res.data);
            // DevSettings.reload();
          })
          .catch((err) => {
            if (err.response.status === 401) {
              AsyncStorage.removeItem('token');
              DevSettings.reload();
            }
            console.log(err);
          });
        Axios.post(
          'http://192.168.100.8:3333/bmasuk',
          {
            stock_bm: barang.stock - stockfix,
            deskripsi: 'Ditambahkan',
            barang_id: barang.id,
          },
          {headers: token},
        )
          .then((res) => {
            console.log(res.data);
            Alert.alert('Sukses', 'Barang Berhasil DiMasukkan');
            DevSettings.reload();
          })
          .catch((err) => {
            if (err.response.status === 401) {
              AsyncStorage.removeItem('token');
              DevSettings.reload();
            }
            console.log(err);
          });
      } else {
        Axios.post(
          `http://192.168.100.8:3333/rak/${rak.id}`,
          {
            id: rak.id,
            nama: rak.nama,
            stock_max: rak.stock_max - barang.stock,
          },
          {headers: token},
        )
          .then((res) => {
            console.log(res.data);
            // setrak(res.data)
          })
          .catch((err) => {
            if (err.response.status === 401) {
              AsyncStorage.removeItem('token');
              DevSettings.reload();
            }
            console.log(err);
          });
        Axios.post(
          `http://192.168.100.8:3333/barang/${barang.id}`,
          {
            id: barang.id,
            produk: barang.produk,
            suplier_id: barang.suplier_id,
            kategori_id: barang.kategori_id,
            stock: 0,
            deskripsi: barang.deskripsi,
          },
          {headers: token},
        )
          .then((res) => {
            console.log(res.data);
            // setPilihBM(res.data)
          })
          .catch((err) => {
            if (err.response.status === 401) {
              AsyncStorage.removeItem('token');
              DevSettings.reload();
            }
            console.log(err);
          });

        Axios.post(
          'http://192.168.100.8:3333/rakterpakai',
          {
            stock: barang.stock,
            rak_id: rak.id,
            barang_id: barang.id,
          },
          {headers: token},
        )
          .then((res) => {
            console.log(res.data);
            // DevSettings.reload();
          })
          .catch((err) => {
            if (err.response.status === 401) {
              AsyncStorage.removeItem('token');
              // window.location.reload()
            }
            console.log(err);
          });
        Axios.post(
          'http://192.168.100.8:3333/bmasuk',
          {
            stock_bm: barang.stock,
            deskripsi: 'Ditambahkan',
            barang_id: barang.id,
          },
          {headers: token},
        )
          .then((res) => {
            console.log(res.data);
            Alert.alert('Sukses', 'Barang Berhasil Ditambahkan');
            DevSettings.reload();
          })
          .catch((err) => {
            if (err.response.status === 401) {
              AsyncStorage.removeItem('token');
              DevSettings.reload();
            }
            console.log(err);
          });
      }
    } else {
      Alert.alert('Gagal', 'Stok Rak Penuh atau Stok Barang Kosong');
    }
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
        <Text style={styles.textItemTitle}>Rak</Text>
        <Text style={styles.textItem}>
          |ID: {rak.id} | - | Nama: {rak.nama} | - | Stock: {rak.stock_max} |
        </Text>
      </View>
      <View>
        <Text style={styles.textItemTitle}>Barang</Text>
        <Text style={styles.textItem}>
          |ID: {barang.id} | - | Produk: {barang.produk} | - | Stock:{' '}
          {barang.stock} |
        </Text>
      </View>
      <View style={styles.buttonLayoutBawah}>
        {rak.id !== '' && barang.id !== '' && (
          <Btn nama="Masukkan Barang" tekan={simpanBarang} />
        )}
      </View>
    </View>
  );
};

export default MasukkanBarang;

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
    paddingVertical: 10,
  },
  buttonWrapper: {
    backgroundColor: '#1c313a',
    justifyContent: 'center',
    borderRadius: 25,
    width: 150,
    height: 50,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
