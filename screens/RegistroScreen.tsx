import { Alert, Button, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from 'firebase/database';
import { auth, db } from '../config/Config';

export default function RegistroScreen({ navigation }: any) {

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [nick, setNick] = useState('');
  const [edad, setEdad] = useState('');

  function RegistroSave() {
    createUserWithEmailAndPassword(auth, correo, contrasenia)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Registro exitoso');

        // Llamando a la función para guardar en la base de datos
        guardar(nombre, apellido, correo, nick, edad);

        // Navegando a la pantalla de bienvenida
        navigation.navigate('Bienvenido');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode);
        switch (errorCode) {
          case 'auth/invalid/credential':
            Alert.alert('Error', 'Las Credenciales son Incorrectas');
            break;
          case 'auth/missing-password':
            Alert.alert('Autenticación', 'Ingrese la contraseña');
            break;
          case 'auth/missing-email':
            Alert.alert('Autenticación', 'Ingrese el Correo');
            break;
          default:
            Alert.alert('Error', 'Contacte con el administrador');
            break;
        }
      });
  }

  function guardar(nombre: string, apellido: string, correo: string, nick: string, edad: string) {
    set(ref(db, 'usuarios/' + nick), {
      name: nombre,
      lastName: apellido,
      email: correo,
      age: edad,
    }).then(() => {
      Alert.alert('Mensaje', 'Datos Guardados');
    }).catch((error) => {
      console.error('Error al guardar en la base de datos:', error);
      Alert.alert('Error', 'Hubo un problema al guardar los datos');
    });
  }

  return (
    <ImageBackground source={require('../assets/image/bienvenida.jpg')}
      style={styles.container}>
      <Text style={styles.titulo}>REGISTRARSE</Text>
      <TextInput
        style={styles.constraint}
        placeholder='Ingresar Nombre'
        onChangeText={(texto) => setNombre(texto)} />
      <View style={{ borderWidth: 1, marginTop: 10, width: 300 }} />

      <TextInput
      style={styles.constraint}
      placeholder='Ingresar Apellido'
      onChangeText={(texto)=>setApellido(texto)}/>
       <View style={{borderWidth:1, marginTop:10, width:300}}/>
       <TextInput
      style={styles.constraint}
      placeholder='Ingrese el NiCk'
      onChangeText={(texto)=>setNick(texto)}/>
       <View style={{borderWidth:1, marginTop:10, width:300}}/>
       <TextInput
      style={styles.constraint}
      placeholder='Ingresar La Edad'
      onChangeText={(texto)=>setEdad(texto)}/>
       <View style={{borderWidth:1, marginTop:10, width:300}}/>

       <TextInput
      style={styles.constraint}
      placeholder='Ingresar Correo'
      keyboardType='email-address'
      onChangeText={(texto)=>setCorreo(texto)}/>
       <View style={{borderWidth:1, marginTop:10, width:300}}/>
       

       <TextInput
      style={styles.constraint}
      placeholder='Ingresar Contraseña'
      secureTextEntry
      onChangeText={(texto)=>setContrasenia(texto)}/>
       <View style={{borderWidth:1, marginTop:10, width:300}}/>

      <Button title='Registrarse' onPress={() => RegistroSave()} color='green' />

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  constraint: {
    padding: 10,
    marginTop: 25,
    color: 'red',
    backgroundColor: '#F3E5AB'
  },
  container: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center'
  },
  titulo: {
    marginTop: 90,
    fontSize: 30,
    fontWeight: "bold",
    color: "#C41E3A",
    textAlign: 'center'
  },
});
