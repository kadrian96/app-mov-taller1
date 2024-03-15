import {
  Alert,
  Image,
  Button,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../config/Config";
import * as ImagePicker from "expo-image-picker";
import {
  getDownloadURL,
  getStorage,
  ref as reff,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../config/Config";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { ResizeMode } from "expo-av";


export default function RegistroScreen({ navigation }: any) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [nick, setNick] = useState("");
  const [edad, setEdad] = useState("");
  const [imagen, setImagen] = useState(" ");
  const [loading, setLoading] = useState(false);

  //Importar fonts
  const [fontsLoaded] = useFonts({
    pixel: require("../assets/fonts/pixel.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    //console.log(result);

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
      //console.log(imagen);
    }
  };

  //Registro de usuario
  async function RegistroSave() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        correo,
        contrasenia
      );
      const user = userCredential.user;
      console.log("Registro exitoso");

      // Llamando a la función para guardar en la base de datos
      guardar(nombre, apellido, correo, nick, edad);
      // agregar la imagen de perfil de usuario si es que la hay
      if (imagen!=" ") {
        //subir la imagen al storage
        const storageRef = reff(storage, "usuarios/" + nick); //se puede coloccar una carpeta para subir el archivo
        try {
          const response = await fetch(imagen);
          const blob = await response.blob();
          await uploadBytes(storageRef, blob, {
            contentType: "image/jpg",
          });
          console.log("La imagen se subió con éxito");
          // Obtener la URL de la imagen
          const imageUrl = await getDownloadURL(storageRef);

          // subir el link de la imagen al profile del usuario
          await updateProfile(user, {
            photoURL: imageUrl,
          });
        } catch (error: any) {
          console.error(error.message);
        }
      }
      await updateProfile(user, {
        displayName: nick,
      });

      // Navegando a la pantalla de bienvenida
      navigation.navigate("Bienvenido");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode);
      switch (errorCode) {
        case "auth/invalid/credential":
          Alert.alert("Error", "Las Credenciales son Incorrectas");
          break;
        case "auth/missing-password":
          Alert.alert("Autenticación", "Ingrese la contraseña");
          break;
        case "auth/missing-email":
          Alert.alert("Autenticación", "Ingrese el Correo");
          break;
        default:
          Alert.alert(errorCode, errorMessage);
          console.error(error);
          break;
      }
    }
  }
  //subir imagen
  async function subirImagen(nombre: string) {
    const storageRef = reff(storage, "usuarios/" + nombre); //se puede coloccar una carpeta para subir el archivo

    try {
      //toman la imagen y la transforman en formato binario
      const response = await fetch(imagen);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob, {
        contentType: "image/jpg",
      });

      console.log("La imagen se subió con éxito");
      Alert.alert("Mensaje", "La imagen se subio correctamente");
      // Obtiene la URL de la imagen
      const imageURL = await getDownloadURL(storageRef);
      console.log("URL de desacarga de la imagen", imageURL);
    } catch (error) {
      console.error(error);
    }
  }

  //subir registro validado

  function RegistroValidacion() {
    if (
      correo.trim() === "" ||
      nick.trim() === "" ||
      contrasenia.trim() === "" ||
      nombre.trim() === "" ||
      apellido.trim() === "" ||
      edad.trim() === ""
    ) {
      Alert.alert(
        "Error de Validación ",
        "Por favor verifique que los campos no esten vacios."
      );
      return;
    } else {
      RegistroSave();

      //LIMPIAR CAMPOS
      setApellido("");
      setContrasenia("");
      setCorreo("");
      setEdad("");
      setImagen("");
      setNick("");
      setNombre("");
    }
  }

  function guardar(
    nombre: string,
    apellido: string,
    correo: string,
    nick: string,
    edad: string
  ) {
    setLoading(true);
    set(ref(db, "usuarios/" + nick), {
      name: nombre,
      lastName: apellido,
      email: correo,
      age: edad,
    })
      .then(() => {
        Alert.alert("Mensaje", "Datos Guardados");
      })
      .catch((error) => {
        console.error("Error al guardar en la base de datos:", error);
        Alert.alert("Error", "Hubo un problema al guardar los datos");
      });
    setLoading(false);
  }

  return (
    <View style={styles.container}>
    <ImageBackground
      source={require("../assets/image/fondo-bienv2.jpg")}
      style={[styles.imgbackground, styles.fixed, { zIndex: -1 }]}
    ></ImageBackground>
      <SafeAreaView style={styles.mainContainer}>
        <KeyboardAwareScrollView
          style={styles.keyboardContainer}
          contentContainerStyle={styles.keyboardContentContainer}
        >
          <View style={styles.modalView}>
            <ImageBackground
              source={require("../assets/image/fondo-bienv2.jpg")}
              style={styles.imgmodal}
              blurRadius={30}
              imageStyle={{opacity:0.6}}
              
            >
              <Text style={styles.titulo}>Registrate</Text>

              <TouchableOpacity onPress={pickImage} style={styles.boton}>
                <Text style={styles.textoBoton}>sube una imagen de perfil</Text>
              </TouchableOpacity>

              {imagen && (
                <View>
                  <Image source={{ uri: imagen }} style={styles.imagen} />
                </View>
              )}

              <TextInput
                style={styles.input}
                placeholder="Ingresar Nombre"
                onChangeText={(texto) => setNombre(texto)}
                value={nombre}
              />

              <TextInput
                style={styles.input}
                placeholder="Ingresar Apellido"
                onChangeText={(texto) => setApellido(texto)}
                value={apellido}
              />

              <TextInput
                style={styles.input}
                placeholder="Ingrese el Nick"
                onChangeText={(texto) => setNick(texto)}
                autoCapitalize="none"
                value={nick}
              />
              <TextInput
                style={styles.input}
                placeholder="Ingresar La Edad"
                onChangeText={(texto) => setEdad(texto)}
                keyboardType="numeric"
                value={edad}
              />

              <TextInput
                style={styles.input}
                placeholder="Ingresar Correo"
                keyboardType="email-address"
                onChangeText={(texto) => setCorreo(texto)}
                autoCapitalize="none"
                value={correo}
              />

              <TextInput
                style={styles.input}
                placeholder="Ingresar Contraseña"
                secureTextEntry
                onChangeText={(texto) => setContrasenia(texto)}
                value={contrasenia}
              />

              <Text
              style={{fontSize:16, fontWeight:'500', marginTop:10}}>
                ¿Ya tienes cuenta?{" "}
                <Text
                  style={{ textDecorationLine: "underline", color: "blue", fontSize:16}}
                  onPress={() => navigation.navigate("Login")}
                >
                  Inicia Sesion
                </Text>
              </Text>
              <View style={{ height: 30, width: "100%" }} />
              <Button
                title="Registrarse"
                onPress={() => RegistroValidacion()}
                color="green"
              />
            </ImageBackground>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject, // Esto hace que el contenedor ocupe toda la pantalla
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Fondo semi-transparente
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
  },
  imgbackground: {
    width: Dimensions.get("screen").width, //for full screen
    height: Dimensions.get("screen").height, //for full screen
    resizeMode: "cover",
  },
  fixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  titulo: {
    marginTop: 30,
    fontSize: 30,
    fontFamily: "pixel",
    color: "#C41E3A",
    textAlign: "center",
    marginBottom: 5,
  },
  boton: {
    backgroundColor: "#C41E3A",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  textoBoton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginVertical: 15,
  },
  centeredView: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    //padding: 20,
    alignItems: "center",
    overflow:'hidden'
  },
  input: {
    height: 40,
    width: 300,
    borderColor: "#246BCE",
    borderWidth: 1,
    marginVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  mainContainer: {
    flex: 1,
    marginTop:50,
    //marginBottom: 10,
    justifyContent: "center",
  },

  keyboardContainer: {
    flex: 1,
  },
  keyboardContentContainer: {
    //flex:1,

    justifyContent: "center",
  },
  imgmodal: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    padding:20,
    
  },
});
