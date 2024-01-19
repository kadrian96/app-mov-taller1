import { Image, ImageBackground, Modal, Pressable, ActivityIndicator  } from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../config/Config";
import {
  getDownloadURL,
  getStorage,
  ref as reff,
  uploadBytes,
} from "firebase/storage";
import {
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import {
  Alert,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  View,
} from "react-native";
//FIREBASE
import { getAuth, updateProfile, updateEmail, signOut } from "firebase/auth";
import { auth, db } from "../config/Config";

export default function PerfilScreen({ navigation }: any) {
  const [datos, setDatos] = useState<any>({
    name: "",
    lastName: "",
    nick: "",
    age: "",
    email: "",
  });

  const [userimg, setuserimg] = useState("https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg");
  const [nick, setnick] = useState("")
  const [name, setName] = useState("")
  const [lastname, setLastName] = useState("")
  const [age, setAge] = useState("")
  const [mail, setMail] = useState("")
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {    
    const fetchData = async () => {
      try {
        const user = usuarioActual();
        if (user === null){
          return;
        }        
        setnick(user.displayName?user.displayName:"");
        const starCountRef = ref(db, "usuarios/" + user.displayName);
        onValue(starCountRef, (snapshot) => {
          if(datos.name != "") return
          if (snapshot.exists()) {
            const data = snapshot.val();
            setDatos(data);
            setUsuario(data);
            return
          } else {
            console.error('No hay datos en la referencia.');
          }
        });
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchData();
  }, []);

  function setUsuario(data: any) {
    setName(data.name);
    setLastName(data.lastName);
    setAge(data.age);
    setMail(data.email);
  }

  function usuarioActual() {
    const user = auth.currentUser;
    if (user !== null) {      
      const photoURL: any = user.photoURL;
      setuserimg(photoURL);          
    }   
    return user
  }

  function cerrarSesion() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        Alert.alert("Mensaje", "Se cerro la sesion");
        navigation.navigate("Welcome");
      })
      .catch((error) => {
        Alert.alert(error.code, error.message);
      });
  }

  function editar() {
    setEditable(!editable);
  }
  
  const pickImage = async () => {
    if(!editable){
      return
    }
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });


    if (!result.canceled) {
      setuserimg(result.assets[0].uri);
    }
  };
  async function guardar() {

    setLoading(true);
    update(ref(db, "usuarios/" + nick), {
      name: name,
      lastName: lastname,
      //email: mail,
      age: age,
    });

    const user = auth.currentUser;
    if (user === null) {      
          return
    }

    if (userimg) {
      //subir la imagen al storage
      const storageRef = reff(storage, "usuarios/" + nick); //se puede coloccar una carpeta para subir el archivo
      try {
    
        const response = await fetch(userimg);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob, {
          contentType: "image/jpg",
        });
        console.log("La imagen se subió con éxito");
        // Obtener la URL de la imagen
        const imageUrl = await getDownloadURL(storageRef);       

        await updateProfile(user, {
          photoURL: imageUrl,
          displayName: nick
        });
      } catch (error:any) {
        console.error(error.message);
      }
    }
 
    // try {     
    //   await updateEmail(user, mail);
    // } catch (error:any) {
    //   console.info(error.message);
    // }
    Alert.alert("Éxito", "Registro actualizado");
    setEditable(!editable);
    setLoading(false);
  }
  return (

    <ImageBackground
      source={require("../assets/image/fondo-perfil.jpg")}
      style={styles.container}
    >

<ScrollView contentContainerStyle={styles.scrollContainer}>

<View style={styles.content}>
      <Text style={styles.titulo}>Bienvenido a tu perfil</Text>
        <Pressable style={styles.circleContainer} onPress={() => pickImage()} >
          <Image source={{ uri: userimg }} style={styles.profileImage} />
        </Pressable>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nick</Text>
        <TextInput
        style={styles.input}
        placeholder="Nick"
        value={nick}
        editable={false}
        onChangeText={(text) => setnick(nick)}
      />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        editable={editable}
        onChangeText={(text) => setName(text)}
      />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Apellido</Text>
        <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastname}
        editable={editable}
        onChangeText={(text) => setLastName(text)}
      />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Edad</Text>
        <TextInput
        style={styles.input}
        placeholder="Edad"
        value={age}
        editable={editable}
        onChangeText={(text) => setAge(text)}
      />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo</Text>
        <TextInput
        style={styles.input}
        placeholder="Correo"
        value={mail}
        editable={false}
        onChangeText={(text) => setMail(text)}
      />
      </View>
            
      {!editable && (
        <Pressable style={styles.btnEditar} onPress={() => editar()}>
        <Text style={styles.textbtn}>Editar</Text>
      </Pressable>
      )}
      
      {editable && (
        <Pressable style={styles.btnsalir} onPress={() => guardar()}>
          <Text style={styles.textbtn}>Guardar</Text>
        </Pressable>
      )}
      
      <Pressable style={styles.btnsalir} onPress={() => cerrarSesion()}>
        <Text style={styles.textbtn}>Cerrar Sesion</Text>
      </Pressable>  
      </View> 
      
     
      </ScrollView>  
      {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject, // Esto hace que el contenedor ocupe toda la pantalla
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '80%',
  }, 
  label: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
  },
  titulo: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "#C41E3A",
    textAlign: "center",
    marginBottom: 80,
  },
  circleContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 50,
  },
  btnsalir: {
    width: 120,
    height: 50,
    backgroundColor: "red",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  
  btnEditar: {
    width: 120,
    height: 50, 
    backgroundColor: "green",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  textbtn: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    height:500,
    width:300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  gameovertxt:{
    color:'red',
    marginVertical:10,
    fontSize:25,
    fontWeight:'bold'
  },
  puntuaciontxt:{
    color:'blue',
    marginVertical:10,
    fontSize:20,
    fontWeight:'bold'
  },
  containbtn:{

    alignItems:'center'

  },
  btnreinicio:{
    width:100,
    height:50,
    backgroundColor:'blue',
    marginVertical:5,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10
  },
  btnlog:{
    width:100,
    height:50,
    backgroundColor:'red',
    marginVertical:5,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10
  },
  textbtnlog:{
    color:'white',
    fontWeight:'bold',
    fontSize:15
  },
levelbtn: {
  width: 100,
  height: 50,
  marginVertical: 5,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10
},
leveltitle: {
  marginTop: 30,
  fontSize: 25,
  fontWeight: "bold",
  color: "#D2691E",
  textAlign: 'center',
  marginBottom: 20
}
  
});
