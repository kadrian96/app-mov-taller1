import { Image, ImageBackground, Modal, Pressable, ActivityIndicator, Dimensions  } from "react-native";
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
import { useFonts } from "expo-font";
import { Icon } from "@rneui/base";

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

 //Importar fonts
 const [fontsLoaded] = useFonts({
  pixel: require("../assets/fonts/pixel.ttf"),
});

if (!fontsLoaded) {
  return null;
}


  return (

    <View style={styles.container}>

    <ImageBackground
      source={require("../assets/image/modal-gameover6.jpg")}
      style={[styles.imgbackground, styles.fixed, { zIndex: -1 }]}
    />

<ScrollView contentContainerStyle={styles.keyboardContentContainer}
           style={styles.keyboardContainer}
           keyboardShouldPersistTaps="handled" >

<View style={styles.content}>
      <Text style={styles.titulo}>Bienvenido</Text>
      
        <Pressable style={styles.circleContainer} onPress={() => pickImage()} >
          <ImageBackground source={{ uri: userimg }} style={styles.profileImage}>
          {editable && (
               <Icon name='edit' type='material' color='#42A5F5' style={{marginTop:80, marginLeft:30}}/>
          )}
         
          </ImageBackground>
        </Pressable>
        

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nick:</Text>
        <TextInput
        style={[styles.input,{color:'#707B7C', fontWeight:'400',fontStyle:'italic',borderBottomColor:'#16A085'}]}
        placeholder="Nick"
        value={nick}
        editable={false}
        onChangeText={(text) => setnick(nick)}
        
      />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
        style={[styles.input,{color:editable ? 'black' :'#707B7C', fontWeight:editable ? 'normal' : '400',fontStyle: editable ? 'normal' : 'italic', borderBottomColor: editable ? '#3498DB':'#16A085'}]}
        placeholder="Nombre"
        value={name}
        editable={editable}
        onChangeText={(text) => setName(text)}
      />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Apellido:</Text>
        <TextInput
        style={[styles.input,{color:editable ? 'black' :'#707B7C', fontWeight:editable ? 'normal' : '400',fontStyle: editable ? 'normal' : 'italic', borderBottomColor: editable ? '#3498DB':'#16A085'}]}
        placeholder="Apellido"
        value={lastname}
        editable={editable}
        onChangeText={(text) => setLastName(text)}
      />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Edad:</Text>
        <TextInput
        style={[styles.input,{color:editable ? 'black' :'#707B7C', fontWeight:editable ? 'normal' : '400',fontStyle: editable ? 'normal' : 'italic', borderBottomColor: editable ? '#3498DB':'#16A085'}]}
        placeholder="Edad"
        value={age}
        editable={editable}
        onChangeText={(text) => setAge(text)}
      />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Correo:</Text>
        <TextInput
        style={[styles.input,{color:'#707B7C', fontWeight:'400', fontStyle:'italic',borderBottomColor:'#16A085'}]}
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
        <Pressable style={styles.btnguardar} onPress={() => guardar()}>
          <Text style={styles.textbtn}>Guardar</Text>
        </Pressable>
      )}
      {editable && (
        <Pressable style={styles.btncancelar} onPress={() => setEditable(!editable)}>
          <Text style={styles.textbtn}>Cancelar</Text>
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
    </View>
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
    width:'100%',
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: 250,
  }, 
  label: {
    width:70,
    marginRight: 10,
    fontSize: 17,
    fontWeight: 'bold',
    color:'#696969'
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth:0.5,
    borderRadius:12,
    borderBottomWidth: 4,
    paddingHorizontal: 10,
    //borderBottomColor:'#16A085',
   
    
  
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  titulo: {
    marginTop: 30,
    fontSize: 30,
    fontFamily: "pixel",
    color: "#D4AC0D",
    textAlign: "center",
    marginBottom: 40,
    textShadowColor: '#F2F3F4',
    textShadowOffset: { width: -2, height: 5 },
    textShadowRadius: 12

  },
  circleContainer: {
    position:"relative",
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
    height: 40,
    backgroundColor: "red",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  
  btnEditar: {
    width: 120,
    height: 40, 
    backgroundColor: "#1db954",
    marginTop: 15,
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
},
btnguardar: {
  width: 120,
  height: 40,
  backgroundColor: "#4169e1",
  marginTop: 10,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 10,
},
btncancelar: {
  width: 120,
  height: 40,
  backgroundColor: "#FFC107",
  marginTop: 10,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 10,
},
fixed: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
imgbackground: {
  width: Dimensions.get("window").width, //for full screen
  height: Dimensions.get("window").height, //for full screen
  resizeMode:"cover",
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
