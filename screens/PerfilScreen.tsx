import { Image, ImageBackground, Modal, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
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
  TextInput,
  View,
} from "react-native";
//FIREBASE
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
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
      console.log(user);      
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
  
  function guardar() {
    update(ref(db, "usuarios/" + nick), {
      name: name,
      lastName: lastname,
      email: mail,
      age: age,
    });
    Alert.alert("Éxito", "Registro actualizado");
    setEditable(!editable);
  }
  return (

    <ImageBackground
      source={require("../assets/image/fondo-perfil.jpg")}
      style={styles.container}
    >
      <Text style={styles.titulo}>Bienvenido a tu perfil</Text>
      <View style={styles.circleContainer}>
        <Image source={{ uri: userimg }} style={styles.profileImage} />
      </View>

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
        editable={editable}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

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
    marginTop: 65,
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
    marginBottom: 30,
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
