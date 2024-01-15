import { Image, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, onValue, ref, remove, set, update  } from 'firebase/database';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { db } from '../config/Config';

export default function PerfilScreen({navigation}:any) {
  const [datos, setDatos] = useState([]);

  function salir(){
 

    const auth = getAuth();
    signOut(auth).then(() => {
     navigation.navigate('Welcome')
    }).catch((error) => {
      // An error happened.
    });
    }

  
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
            <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Login')}>
            <Text style={styles.textbutton}>PUSH</Text>
            <Image
            style={styles.img2}
            source={require('../assets/image/salida.png')}
            />
      </TouchableOpacity>
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
img2:{

  flex: 1,
  alignItems: 'center',
  padding: 10,
  marginBottom: 20,

},
textbutton:{
  fontSize:15,
  color:'red',
  fontWeight:'bold',
  

},
btn:{
    
  width: 105,
  height: 130,
 alignItems: 'center',
  justifyContent: 'flex-start', 
  marginTop: 500, 
  paddingTop: 8,
  borderRadius: 5,
},

})