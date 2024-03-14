import {
  Alert,
  Button,
  Dimensions,
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
import { useFonts } from "expo-font";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function LoginScreen({ navigation }: any) {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");

  //Importar fonts
  const [fontsLoaded] = useFonts({
    pixel: require("../assets/fonts/pixel.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

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
    <View style={styles.container}>
    <ImageBackground
      source={require("../assets/image/iniciosesion.jpeg")}
      style={[styles.imgbackground, styles.fixed, { zIndex: -1 }]}
    ></ImageBackground>
      <KeyboardAwareScrollView
        style={styles.keyboardContainer}
        contentContainerStyle={styles.keyboardContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}> INICIO DE SESION</Text>

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
          secureTextEntry
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
      </KeyboardAwareScrollView>
    
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    
    alignItems: "center",
  },
  imgbackground: {
    width: Dimensions.get("screen").width, //for full screen
    height: Dimensions.get("screen").height, //for full screen
    resizeMode:"cover",
  },
  fixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },


  btn: {
    width: 100,
    height: 40,
    alignItems: "center",
    //verticalAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: "rgb(89,166,98)",
    justifyContent: "center",
    borderRadius: 5,
  },
  btn1: {
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: "#B0BF1A",
    borderRadius: 5,
  },
  btn2: {
    width: 100,
    height: 40,
    alignItems: "center",
    verticalAlign: "center",
    marginVertical: 10,
    backgroundColor: "#f25022",
    justifyContent: "center",
    borderRadius: 5,
  },
  textbutton: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  titulo: {
    marginTop: 230,
    fontSize: 30,
    /*fontWeight: "bold",*/
    color: "#ffb900",
    textAlign: "center",
    marginBottom: 50,
    fontFamily: "pixel",
  },
  input: {
    width: "70%",
    height: 45,
    marginBottom: 30,
    borderRadius: 10,
    fontSize: 18, //TEXTO DENTRO DEL BOTON
    backgroundColor: "#eee",
    paddingLeft: 20,
  },
  keyboardContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  keyboardContentContainer: {
    //flex:1,
    alignItems: "center",
    justifyContent: "center",
  },
});
