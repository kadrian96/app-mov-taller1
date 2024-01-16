import { Alert, Image, Button, ImageBackground, TouchableOpacity, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from 'firebase/database';
import { auth, db } from '../config/Config';
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref as reff, uploadBytes } from "firebase/storage";
import { storage } from "../config/Config";
import LoginScreen from './LoginScreen';



export default function RegistroScreen({ navigation }: any) {

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [nick, setNick] = useState('');
  const [edad, setEdad] = useState('');
  const [imagen, setImagen] = useState(" ");

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
      console.log(imagen)
    }
  };

  async function RegistroSave() {

    const storageRef = reff(storage, "usuarios/" + nick); //se puede coloccar una carpeta para subir el archivo
    try {
      //toman la imagen y la transforman en formato binario
      const response = await fetch(imagen);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob, {
        contentType: "image/jpg",
      });
      console.log("La imagen se subió con éxito");

      if (!correo || !nick || !contrasenia) {
        Alert.alert("Error de Validación ", 'Por favor verifique los campos que no pueden estar vacios.');
        return;
      }
    } catch (error) {
      console.error(error);
    }

    createUserWithEmailAndPassword(auth, correo, contrasenia)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Registro exitoso');

        // Llamando a la función para guardar en la base de datos
        guardar(nombre, apellido, correo, nick, edad);

        // Navegando a la pantalla de bienvenida
        navigation.navigate('My_Bottomtab');
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
     
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error.menssage);
      
      
      console.error('Error al guardar en la base de datos:', error);
      Alert.alert('Error', 'Hubo un problema al guardar los datos');
    });
  }

  return (
    <ImageBackground source={require('../assets/image/bienvenida.jpg')}
      style={styles.container}>
      <Text style={styles.titulo}>REGISTRARSE</Text>

      <TouchableOpacity onPress={pickImage} style={styles.boton}>
        <Text style={styles.textoBoton}>Seleccionar desde la Galería</Text>
      </TouchableOpacity>



      {imagen && (
        <View>
          <Image source={{ uri: imagen }} style={styles.imagen} />
        </View>
      )}


      <TextInput
        style={styles.input}
        placeholder='Ingresar Nombre'
        onChangeText={(texto) => setNombre(texto)} />


      <TextInput
        style={styles.input}
        placeholder='Ingresar Apellido'
        onChangeText={(texto) => setApellido(texto)} />

      <TextInput
        style={styles.input}
        placeholder='Ingrese el NiCk'
        onChangeText={(texto) => setNick(texto)} />

      <TextInput
        style={styles.input}
        placeholder='Ingresar La Edad'
        onChangeText={(texto) => setEdad(texto)} />


      <TextInput
        style={styles.input}
        placeholder='Ingresar Correo'
        keyboardType='email-address'
        onChangeText={(texto) => setCorreo(texto)} />



      <TextInput
        style={styles.input}
        placeholder='Ingresar Contraseña'
        //secureTextEntry
        onChangeText={(texto) => setContrasenia(texto)} />


      <Button title='Registrarse' onPress={() => RegistroSave()} color='rgb(89,166,98)' />
      <Text></Text>
      <Button title='Regresar' onPress={() => navigation.navigate('Login')} color='#db4437' />

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
    color: "#C41E",
    textAlign: 'center'
  },
  boton: {
    backgroundColor: '#C41E',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginTop: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    height: 45,
    marginBottom: 10,
    borderRadius: 15,
    padding: 15,
    //backgroundColor: '#eee',
  },
});
