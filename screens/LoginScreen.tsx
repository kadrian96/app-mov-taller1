import { Alert, Button, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/Config';


export default function LoginScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('')
  const [contrasenia, setContrasenia] = useState('')

  function login() {
    signInWithEmailAndPassword(auth, correo, contrasenia)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    navigation.navigate('Bienvenido')
    // ...
  })
  .catch((error) => {
    console.log('acceso denegado');
    console.log(error.code);
    const errorCode = error.code;
    const errorMessage = error.message;
    switch (errorCode) {
      case 'auth/invalid/credential':
        Alert.alert('Error', 'Las credenciales son incorrectas');
        break;
      case 'auth/missing-password':
        Alert.alert('Error', 'La contraseña no se ha enviado');
        break;
        case 'auth/invalid-email':
        Alert.alert('Error', 'Ingrese un correo ');
        break;
      default:
        Alert.alert('Error', 'Contacte con el administrador');
        break;
    }
  });

    // LIMPIAR DATOS
    setCorreo("")
    setContrasenia("")

  }

  return (

    <ImageBackground
      source={require('../assets/image/iniciosesion.jpeg')}
      style={styles.container}
    >
      <Text style={styles.titulo}> INICIO DE SESION</Text>

      <TextInput
        style={styles.input}
        placeholder='Ingresar Correo'
        onChangeText={(texto) => setCorreo(texto)}
        keyboardType='email-address'
        autoCapitalize='none'
        value={correo}
      />

      <TextInput
        style={styles.input}
        placeholder='Ingresar Contraseña'
        onChangeText={(texto) => setContrasenia(texto)}
        value={contrasenia}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={() => login()}>
        <Text style={styles.textbutton}>INGRESAR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn1} onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.textbutton}>REGISTRAR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('Welcome')}>
        <Text style={styles.textbutton}>REGRESAR</Text>
      </TouchableOpacity>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  constraint: {
    padding: 10,
    marginTop: 30,
    alignItems: 'center',
    color: 'black',
    backgroundColor: '#F3E5AB'
  },
  container: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center'
  },

  btn: {
    width: 100,
    height: 25,
    alignItems: 'center',
    //verticalAlign: 'center',
    marginVertical: 10,
    backgroundColor: 'rgb(89,166,98)',
    paddingTop: 5,

    borderRadius: 5
  },
  btn1: {
    width: 100,
    height: 25,
    alignItems: 'center',
    verticalAlign: 'center',
    marginVertical: 10,
    backgroundColor: '#B0BF1A',
    paddingTop: 5,

    borderRadius: 5
  },
  btn2: {
    width: 100,
    height: 25,
    alignItems: 'center',
    verticalAlign: 'center',
    marginVertical: 10,
    backgroundColor: '#f25022',
    paddingTop: 5,

    borderRadius: 5
  },
  textbutton: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold'

  },
  titulo: {
    marginTop: 230,
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffb900",
    textAlign: 'center',
    marginBottom:40



  },
  input: {
    width: '70%',
    borderWidth: 1,
    height: 45,
    marginBottom: 40,
    borderRadius: 20,
    padding: 10,
    //marginTop: 10,
    fontSize: 23,  //TEXTO DENTRO DEL BOTON
    backgroundColor: '#eee',
    paddingLeft:20
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#db4437',
    marginHorizontal: 5, // Ajusta este valor según sea necesario
  },

})