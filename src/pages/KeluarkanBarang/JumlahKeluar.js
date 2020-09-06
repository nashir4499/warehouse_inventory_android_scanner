import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Alert, DevSettings} from 'react-native';
import Axios from 'axios';
import {TouchableOpacity, TextInput} from 'react-native-gesture-handler';

const JumlahKeluar = ({navigation, route}) => {
  const [semua, setSemua] = useState(false);
  const [jumlah, setJumlah] = useState('');
  const token = route.params.token;
  const [yes, setYes] = useState(false);

  useEffect(() => {
    getIsirak();
  }, []);
  const [isiRak, setIsiRak] = useState({
    id: '',
    stock: '',
    rak_id: '',
    barang_id: '',
    barang: {},
    rak: {},
  });

  const getIsirak = () => {
    Axios.get(`http://192.168.100.8:3333/rakterpakai/${route.params.id}`, {
      headers: token,
    })
      .then((res) => {
        setIsiRak({
          id: res.data.id,
          stock: res.data.stock,
          rak_id: res.data.rak_id,
          barang_id: res.data.barang_id,
          barang: res.data.barang,
          rak: res.data.rak,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleKeluarSemua = () => {
    // console.log(isiRak.rak.stock_max + isiRak.stock)
    Axios.post(
      'http://192.168.100.8:3333/bkeluar',
      {
        stock_bk: isiRak.stock,
        deskripsi: 'Barang Keluar',
        barang_id: isiRak.barang_id,
      },
      {headers: token},
    )
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
    Axios.post(
      `http://192.168.100.8:3333/rak/${isiRak.rak_id}`,
      {
        id: isiRak.rak.id,
        nama: isiRak.rak.nama,
        stock_max: isiRak.rak.stock_max + isiRak.stock,
      },
      {headers: token},
    )
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    Axios.delete(`http://192.168.100.8:3333/rakterpakai/${isiRak.id}`, {
      headers: token,
    }) //pake bactrik kalo mau ngirim parameter
      .then((response) => {
        Alert.alert('Sukses', 'Barang Berhasil Dikeluarkan');
        DevSettings.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const confirm = () => {
    Alert.alert(
      'Confirm',
      `Keluarkan ${isiRak.barang.produk}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'YES', onPress: () => handleKeluarSemua()},
      ],
      {cancelable: false},
    );
  };

  const handleSebagian = () => {
    console.log(jumlah);
    if (jumlah < isiRak.stock && jumlah > 0) {
      Alert.alert(
        'Confirm',
        `Keluarkan ${jumlah} buah ${isiRak.barang.produk}?`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'YES', onPress: () => sebagian()},
        ],
        {cancelable: false},
      );
    } else if (jumlah === isiRak.stock) {
      Alert.alert('Gagal', 'Silahkan pilih menu keluar "semua"');
    } else if (jumlah < 1) {
      Alert.alert('Gagal', 'Jumlah yang anda masukkan tidak sesuai');
    } else {
      Alert.alert('Gagal', 'Melebihi batas');
    }
  };

  const sebagian = () => {
    // console.log(res.data.rak.stock_max + res.data.stock)
    Axios.post(
      'http://192.168.100.8:3333/bkeluar',
      {
        stock_bk: parseInt(jumlah, 10),
        deskripsi: 'Barang Keluar',
        barang_id: isiRak.barang_id,
      },
      {headers: token},
    )
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
    Axios.post(
      `http://192.168.100.8:3333/rak/${isiRak.rak_id}`,
      {
        id: isiRak.rak.id,
        nama: isiRak.rak.nama,
        stock_max: isiRak.rak.stock_max + parseInt(jumlah, 10),
      },
      {headers: token},
    )
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    Axios.post(
      `http://192.168.100.8:3333/rakterpakai/${isiRak.id}`,
      {
        id: isiRak.id,
        stock: isiRak.stock - parseInt(jumlah, 10),
        rak_id: isiRak.rak_id,
        barang_id: isiRak.barang_id,
      },
      {headers: token},
    ) //pake bactrik kalo mau ngirim parameter
      .then((response) => {
        Alert.alert('Sukses', 'Barang Berhasil Dikeluarkan');
        DevSettings.reload();
      })
      .catch((err) => {
        console.log(err);
      });
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
      <Text style={styles.textItem}>
        {isiRak.barang.produk} dari rak {isiRak.rak.nama}
      </Text>
      <Text style={styles.textItem}>
        stok yang ada {isiRak.stock}. Pilih jumlah yang akan dikeluarkan
      </Text>
      <View style={styles.buttonLayout}>
        <Btn nama="Semua" tekan={() => setSemua(true)} />
        <Btn nama="Sebagian" tekan={() => setSemua(false)} />
      </View>
      {semua ? (
        <Btn
          nama="Tekan di sini untuk mengeluarkan Semua barang"
          tekan={() => confirm()}
        />
      ) : (
        <View style={styles.sebgaianLayout}>
          <TextInput
            style={styles.inputBox}
            placeholder="Masukkan Jumlah Keluar"
            placeholderTextColor="#fff"
            keyboardType="numeric"
            value={jumlah}
            // onChangeText={(e) => setJumlah(e.target.value)}
            onChangeText={setJumlah}
          />
          <Btn nama="Barang Keluar" tekan={() => handleSebagian()} />
        </View>
      )}
    </View>
  );
};

export default JumlahKeluar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#455a64',
  },
  textItem: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    // marginBottom: 20,
  },
  inputBox: {
    width: 250,
    height: 50,
    backgroundColor: 'rgba(255, 255,255,0.2)',
    color: '#fff',
    textAlign: 'center',
    textDecorationLine: 'underline',
    borderRadius: 25,
    paddingLeft: 20,
    marginVertical: 10,
  },
  buttonLayout: {
    flexDirection: 'row',
    marginVertical: 20,
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
  sebgaianLayout: {
    alignItems: 'center',
  },
});
