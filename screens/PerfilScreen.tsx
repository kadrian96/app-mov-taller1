import React, { useEffect, useState } from 'react';
import { ImageBackground, TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, onValue, ref } from 'firebase/database';
import { db } from '../config/Config';

export default function PerfilScreen({ navigation }: any) {
  const [datos, setDatos] = useState([]);
  const [usuario, setUsuario] = useState(null)

  // LEER LOS DATOs
  useEffect(() => {
    const leer = () => {
      const starCountRef = ref(db, 'usuarios/');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dataTemp: any = Object.keys(data).map((key) => ({
            key,
            ...data[key],
          }));
          setDatos(dataTemp);
        }
      });
    };

    leer();
  }, []);

  type Usuario = {
    nombre: string;
    apellido: string;
    nick: string;
    edad: string;
    correo: string;
  };

  function salir() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigation.navigate('Welcome');
      })
      .catch((error) => {
        // An error happened.
      });
  }
  const obtenerUsuarioPorNick = (nick: string) => {
    const usuarioEncontrado : any = datos.find((usuario: Usuario) => usuario.nick === nick);
    setUsuario(usuarioEncontrado);
  };

  return (
    <ImageBackground source={require('../assets/image/bienvenida.jpg')} style={styles.container}>
      <View style={styles.separator} />
      <FlatList
        data={datos}
        renderItem={({ item }: { item: Usuario }) => (
          <View>
            <View style={styles.separator} />
            <Text>Cedula: {item.nick}</Text>
            <Text>Nombre: {item.nombre}</Text>
            <Text>Ciudad: {item.apellido}</Text>
            <Text>Edad: {item.edad}</Text>
            <Text>Correo: {item.correo}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.textButton}>PUSH</Text>
              <Image style={styles.img} source={require('../assets/image/salida.png')} />
            </TouchableOpacity>
          </View>
        )}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
  },
  separator: {
    borderWidth: 1,
    width: '100%',
    marginTop: 10,
  },
 
img: {
  maxWidth: '79%',  // Establece el ancho máximo al 100% del contenedor
  maxHeight: "68%",    // Ajusta la altura máxima según sea necesario
  alignItems: 'center',
  
  padding: 10,
  marginBottom: 20,
},
  textButton: {
    fontSize: 15,
    color: 'red',
    fontWeight: 'bold',
  },
  btn: {
    width: 105,
    height: 130,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20, // Ajustar según sea necesario
    paddingTop: 8,
    borderRadius: 5,
  },
});