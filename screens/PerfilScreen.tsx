import { ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getDatabase, onValue, ref, remove, set, update } from 'firebase/database';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { db } from '../config/Config';

export default function PerfilScreen() {
  const [datos, setDatos] = useState([]);

  
   // LEER LOS DATOS
   useEffect(() => {
    const leer = () => {
      const starCountRef = ref(db, 'usuarios/');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dataTemp : any = Object.keys(data).map((key) => ({
            key,
            ...data[key],
          }));
          setDatos(dataTemp);
        }
      });
    };

    leer();
  }, []);

  type usuario={
nombre:string,
apellido:string,
nick:string,
edad:string,
correo:string}
  
  return (
    <ImageBackground  source={require('../assets/image/bienvenida.jpg')}
    style={styles.container}>
     <View style={{ borderWidth: 1, width: '100%', marginTop: 10 }} />
      <FlatList
        data={datos}
        renderItem={({ item }:{item:usuario }) => (
          <View>
            <View style={{ borderWidth: 1, width: '100%', marginTop: 10 }} />
            <Text>Cedula: {item.nick}</Text>
            <Text>Nombre: {item.nombre}</Text>
            <Text>Ciudad: {item.apellido}</Text>
            <Text>Nombre: {item.edad}</Text>
            <Text>Ciudad: {item.correo}</Text>
          </View>
        )}
      />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    resizeMode:'cover',
    alignItems:'center'
},

})