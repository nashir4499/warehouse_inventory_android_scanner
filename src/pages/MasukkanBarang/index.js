import React, {useState} from 'react';
import {StyleSheet, Text, View, DevSettings, Alert} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RNCamera} from 'react-native-camera';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {url} from '../../service/config';

const MasukkanBarang = ({navigation, route}) => {
  const [raks, setRaks] = useState([]);
  const [barangs, setBarangs] = useState([]);
  const [rak, setRak] = useState({
    id: '',
    nama: '',
    volume_rak: '',
    panjang: '',
    lebar: '',
    tinggi: '',
  });
  const [barang, setBarang] = useState({
    id: '',
    produk: '',
    suplier_id: '',
    kategori_id: '',
    stok: '',
    volume_barang: '',
    panjang: '',
    lebar: '',
    tinggi: '',
    deskripsi: '',
  });

  const [pilihRak, setPilihRak] = useState({
    language: 'rak',
  });

  const [barcodeBarang, setBarcodeBarang] = useState(true);

  const token = {Authorization: 'Bearer ' + route.params.token};

  const scanRak = (e) => {
    // console.log(e);
    // setRak(e.data);
    // const token = route.params.token;
    Axios.get(`${url}/rak/${e.data}`, {
      headers: token,
    })
      .then((res) => {
        console.log(res.data.id);
        setRak({
          id: res.data.id,
          nama: res.data.nama,
          volume_rak: res.data.volume_rak,
          panjang: res.data.panjang,
          lebar: res.data.lebar,
          tinggi: res.data.tinggi,
        });
        setBarcodeBarang(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // Linking.openURL(e.data).catch((err) =>
    // Linking.openURL(
    //   `url/rakAndro/${e.data}`,
    // ).catch((err) => console.error('An error occured', err));
  };

  const scanBarang = (e) => {
    Axios.get(`${url}/barang/${e.data}`, {
      headers: token,
    })
      .then((res) => {
        console.log(res.data.id);
        setBarang({
          id: res.data.id,
          produk: res.data.produk,
          suplier_id: res.data.suplier_id,
          kategori_id: res.data.kategori_id,
          stok: res.data.stok,
          volume_barang: res.data.volume_barang,
          panjang: res.data.panjang,
          lebar: res.data.lebar,
          tinggi: res.data.tinggi,
          deskripsi: res.data.deskripsi,
        });
        setBarcodeBarang(true);
      })
      .catch((err) => {
        console.log(err);
      });
    Axios.get(`${url}/rak`, {headers: token})
      .then((res) => {
        setRaks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    Axios.get(`${url}/barang`, {headers: token})
      .then((res) => {
        setBarangs(res.data);
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

  const Dropdown = () => {
    return (
      // <Picker
      //   selectedValue={pilihRak.language}
      //   style={{height: 50, width: 100}}
      //   onValueChange={(itemValue, itemIndex) =>
      //     setPilihRak({language: itemValue})
      //   }>
      //   {raks &&
      //     raks.map((rakbisa) => {
      //       for (var i = 0; i < barangs.length; i++) {
      //         const modulus = rakbisa.volume_rak % barang.volume_barang;
      //         if (modulus === 0 || modulus % barangs[i].volume_barang === 0) {
      //           return (
      //             // <option key={rakbisa.id} value={rakbisa.id}>
      //             //   {rakbisa.nama} || {rakbisa.volume_rak}cm3
      //             // </option>
      //             <Picker.Item
      //               key={rakbisa.id}
      //               label={`${rakbisa.nama} || ${rakbisa.volume_rak}cm3`}
      //               value={rakbisa.id}
      //             />
      //           );
      //         }
      //       }
      //     })}
      // </Picker>
      <View>asd</View>
      // <RNPickerSelect
      //   onValueChange={(value) => console.log(value)}
      //   items={[
      //     {label: 'Football', value: 'football'},
      //     {label: 'Baseball', value: 'baseball'},
      //     {label: 'Hockey', value: 'hockey'},
      //   ]}
      // />
    );
  };

  const simpanBarang = () => {
    if (rak.volume_rak > 0 && barang.stok > 0) {
      // const stok = rak.volume_rak - pilihBM.stok_bm;
      const jmlBM = rak.volume_rak / barang.volume_barang;
      const jmlVB = barang.volume_barang * barang.stok;
      const stokBnR = Math.floor(jmlBM) - barang.stok;
      console.log(stokBnR);
      if (stokBnR < 0) {
        const stokfix = Math.abs(stokBnR);
        console.log(stokfix);
        const volumeMasuk = (barang.stok - stokfix) * barang.volume_barang;
        const rakVSisa = rak.volume_rak % barang.volume_barang;
        Axios.post(
          `${url}/rak/${rak.id}`,
          {
            id: rak.id,
            nama: rak.nama,
            volume_rak: rakVSisa,
            panjang: rak.panjang,
            lebar: rak.lebar,
            tinggi: rak.tinggi,
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
          `${url}/barang/${barang.id}`,
          {
            id: barang.id,
            produk: barang.produk,
            suplier_id: barang.suplier_id,
            kategori_id: barang.kategori_id,
            stok: stokfix,
            volume_barang: barang.volume_barang,
            panjang: barang.panjang,
            lebar: barang.lebar,
            tinggi: barang.tinggi,
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
          `${url}/rakterpakai`,
          {
            stok: barang.stok - stokfix,
            volume_terpakai: volumeMasuk,
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
          `${url}/bmasuk`,
          {
            stok_bm: barang.stok - stokfix,
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
          `${url}/rak/${rak.id}`,
          {
            id: rak.id,
            nama: rak.nama,
            volume_rak: rak.volume_rak - jmlVB,
            panjang: rak.panjang,
            lebar: rak.lebar,
            tinggi: rak.tinggi,
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
          `${url}/barang/${barang.id}`,
          {
            id: barang.id,
            produk: barang.produk,
            suplier_id: barang.suplier_id,
            kategori_id: barang.kategori_id,
            stok: 0,
            volume_barang: barang.volume_barang,
            panjang: barang.panjang,
            lebar: barang.lebar,
            tinggi: barang.tinggi,
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
          `${url}/rakterpakai`,
          {
            stok: barang.stok,
            volume_terpakai: jmlVB,
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
          `${url}/bmasuk`,
          {
            stok_bm: barang.stok,
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
        <Btn nama="Rak" tekan={() => setBarcodeBarang(true)} />
        <Btn nama="Barang" tekan={() => setBarcodeBarang(false)} />
      </View>
      {barcodeBarang ? (
        <Qcode nama="Barang" scan={scanBarang} />
      ) : (
        <Qcode nama="Rak" scan={scanRak} />
      )}
      <View>
        <Text style={styles.textItemTitle}>Barang</Text>
        <Text style={styles.textItem}>
          |ID: {barang.id} | - | Produk: {barang.produk} | - | stok:{' '}
          {barang.stok} |
        </Text>
      </View>
      <View>
        <Text style={styles.textItemTitle}>Rak Yang Kosong</Text>
        <Dropdown />
      </View>
      <View>
        <Text style={styles.textItemTitle}>Rak</Text>
        <Text style={styles.textItem}>
          |ID: {rak.id} | - | Nama: {rak.nama} | - | stok: {rak.volume_rak} |
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
