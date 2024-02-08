import {
  Alert,
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/Config";

export default function LoginScreen({ navigation }: any) {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");

  function login() {
    signInWithEmailAndPassword(auth, correo, contrasenia)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigation.navigate("Bienvenido");
        // ...
      })
      .catch((error) => {
        console.log("acceso denegado");
        console.log(error.code);
        const errorCode = error.code;
        const errorMessage = error.message;
        switch (errorCode) {
          case "auth/invalid/credential":
            Alert.alert("Error", "Las credenciales son incorrectas");
            break;
          case "auth/missing-password":
            Alert.alert("Error", "La contraseña no se ha enviado");
            break;
          case "auth/invalid-email":
            Alert.alert("Error", "Ingrese un correo ");
            break;
          default:
            Alert.alert("Error", "Contacte con el administrador");
            break;
        }
      });

    // LIMPIAR DATOS
    setCorreo("");
    setContrasenia("");
  }

  return (
    <ImageBackground
      source={require("../assets/image/bienvenida.jpg")}
      style={styles.container}
    >
      <Text style={styles.titulo}> INGRESAR AL JUEGO</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresar Correo"
        onChangeText={(texto) => setCorreo(texto)}
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
      />

      <TextInput
        style={styles.input}
        placeholder="Ingresar Contraseña"
        onChangeText={(texto) => setContrasenia(texto)}
        value={contrasenia}
      />

      <TouchableOpacity style={styles.btn} onPress={() => login()}>
        <Text style={styles.textbutton}>INGRESAR</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn1}
        onPress={() => navigation.navigate("Registro")}
      >
        <Text style={styles.textbutton}>REGISTRAR</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn2}
        onPress={() => navigation.navigate("Welcome")}
      >
        <Text style={styles.textbutton}>REGRESAR</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  constraint: {
    padding: 10,
    marginTop: 30,
    alignItems: "center",
    color: "black",
    backgroundColor: "#F3E5AB",
  },
  container: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
  },

  btn: {
    width: 150,
    height: 35,
    alignItems: "center",
    verticalAlign: "center",
    marginVertical: 20,
    backgroundColor: "rgb(89,166,98)",
    paddingTop: 5,

    borderRadius: 5,
  },
  btn1: {
    width: 150,
    height: 35,
    alignItems: "center",
    verticalAlign: "center",
    marginVertical: 20,
    backgroundColor: "#B0BF1A",
    paddingTop: 5,

    borderRadius: 5,
  },
  btn2: {
    width: 150,
    height: 35,
    alignItems: "center",
    verticalAlign: "center",
    marginVertical: 20,
    backgroundColor: "#841B2D",
    paddingTop: 5,

    borderRadius: 5,
  },
  textbutton: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  titulo: {
    marginTop: 100,
    flex: 0.8,
    fontSize: 30,
    fontWeight: "bold",
    color: "#db4437",
    textAlign: "center",
  },
  input: {
    width: "80%",

    borderWidth: 2,
    height: 45,
    marginBottom: 5,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    fontSize: 23,
    //backgroundColor: '#eee',
  },
});
