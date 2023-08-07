import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BackHandler, Modal } from "react-native";
import { useWindowDimensions } from "react-native";



function FolderScreen({ navigation, route }) {

  const {width} = useWindowDimensions();
  const {height} = useWindowDimensions();
  const cameraHeight = Math.round((width * 16) / 9);
  const btnHeight = (height - cameraHeight) /2;

  const [numFolder, setNumFolder] = useState('');
  const [confieur, setConfieur] = useState('');
  const [marque, setMarque] = useState('');
  const [designation, setDesignation] = useState('');
  const [isPicDefault, setIsPicDefault] = useState(false);
  const [isPicRapport, setIsPicRapport] = useState(false);
  const [isPicFacture, setIsPicFacture] = useState(false);
  const [isPicAutre, setIsPicAutre] = useState(false);
  const [isRapportRempli, setIsRapportRempli] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageURI, setImageURI] = useState(null);
  const [picTypeDisplayed, setpicTypeDisplayed] = useState('');

  function handleBackButtonClick() {
    navigation.navigate('Root');
    return true;
  }

  useEffect(() => {
    //test le type de données nevoyé (tri entre code de dossier et code de piece)
    if(route.params?.type == 'numFolder'){{
      folderFromQRCode(route.params?.numFolder)
    }}
    
    //bouton back
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, [route.params?.type])

  const folderFromQRCode = (numFolder) => {
    if(numFolder){
      getData(numFolder)
      arePhotosAlreadyTaken(numFolder)
    }
  }

  const getData=(numFolder)=>{
    let dataInHeaders = {
      order: 'getFolder',
      numFolder: numFolder,
    }
    fetch('https://test.api.909services.com/getData.php', {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${JSON.stringify(dataInHeaders)}`
      },
      body: JSON.stringify(dataInHeaders)
    })
    .then((response) => response.json())
    .then((responseText) => {
      // console.log(responseText);
      let json = JSON.parse(responseText)
      setNumFolder(json.numDossier)
      setConfieur(json.confieur)
      setMarque(json.marque)
      setDesignation(json.designation)
    })
  }

  const arePhotosAlreadyTaken = (numFolder)=>{
    let dataInHeaders = {
      order: 'arePhotosAlreadyTaken',
      numFolder: numFolder,
    }
    fetch('https://test.api.909services.com/getData.php', {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${JSON.stringify(dataInHeaders)}`
      },
      body: JSON.stringify(dataInHeaders)
    })
    .then((response) => response.json())
    .then((responseText) => {
      // console.log('arePhotosAlreadyTaken : '+responseText);
      let json = JSON.parse(responseText)
      setIsPicDefault(json.defaut_base64Img)
      setIsPicRapport(json.rapport_base64Img)
      setIsPicFacture(json.facture_base64Img)
      setIsPicAutre(json.autre_base64Img)
    })
  }

  const getPhoto = async (picType)=> {
    let imgData = {
      order: 'getPhoto',
      numFolder: numFolder,
      imgType: picType
    }
    fetch('https://test.api.909services.com/getData.php', {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer `
      },
      body: JSON.stringify(imgData)
    })
    .then((response) => response.json())
    .then((responseText) => {
      // console.log(responseText); 
      let json = JSON.parse(responseText)
      setImageURI(json.img);
    })
  }

  //dans fin de fonction renderPhoto qui appelle getPhoto en async
  const renderPhoto = async (picType)=> {
    await getPhoto(picType)
    setpicTypeDisplayed(picType)
    setModalVisible(true)
    console.log(modalVisible);
  }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Modal
        style={styles.modal}
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
        //   Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
            <View style={styles.modalViewContainer}>
            <View style={styles.modalView}>
                <Image source={{uri:`data:image/png;base64,${imageURI}`}} style={styles.photoPreview}/>
                    <TouchableOpacity
                        onPress={()=>{
                          navigation.navigate('CameraScreen', {type: 'photoInfos', numFolder: numFolder, picType: picTypeDisplayed})
                          setModalVisible(false)
                        }}
                        style={{
                            position:'absolute',
                            width:'70%',
                            height:btnHeight,
                            flexDirection: 'row',
                            bottom:'10%',
                            justifyContent:'center',
                            backgroundColor: '#7dcc96',
                            borderRadius: 8
                        }}
                    >
                        <Text
                            style = {styles.btnTxt}
                        >Reprendre la photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{
                          setImageURI('')
                          setModalVisible(false)
                        }}
                        style={{
                            position:'absolute',
                            width:'70%',
                            height:btnHeight,
                            flexDirection: 'row',
                            bottom:'2%',
                            justifyContent:'center',
                            backgroundColor: '#7dcc96',
                            borderRadius: 8
                        }}
                    >
                        <Text
                            style = {styles.btnTxt}
                        >Annuler</Text>
                    </TouchableOpacity>
            </View>
        </View>
        </Modal>
        <View style={styles.wrapperInputDossier}>
          <Text style={styles.inputTitle}>Numéro : </Text>
          <Text style={styles.input}>{numFolder}</Text>
        </View>
        <View style={styles.wrapperInputConfieur}>
          <Text style={styles.inputTitle}>Confieur : </Text>
          <Text style={styles.input}>{confieur}</Text>
        </View>
        <View style={styles.wrapperInputMarque}>
          <Text style={styles.inputTitle}>Marque : </Text>
          <Text style={styles.input}>{marque}</Text>
        </View>
        <View style={styles.wrapperInputDesignation}>
          <Text style={styles.inputTitle}>Designation : </Text>
          <Text style={styles.input}>{designation}</Text>
        </View>
        <TouchableOpacity  
            onPress={isPicDefault ? ()=>{renderPhoto('defaut')} : ()=>{navigation.navigate('CameraScreen', {type: 'photoInfos', numFolder: numFolder, picType: 'defaut'})}} 
            style={isPicDefault ? [styles.btnPicTakenTrue, styles.btnPicDefault] : [styles.btnPicTakenFalse, styles.btnPicDefault]}>
            <Text style={styles.photoTitle}>{isPicDefault ? 'Photo du défaut enregistrée' : 'Prendre une photo du défaut'}</Text>
          <Image source={require('../assets/camera_icon.png')} style={styles.img}/>
        </TouchableOpacity>
        <TouchableOpacity 
            onPress={isPicRapport ? ()=>{renderPhoto('rapport')} : ()=>{navigation.navigate('CameraScreen', {type: 'photoInfos', numFolder: numFolder, picType: 'rapport'})}} 
            style={isPicRapport ? [styles.btnPicTakenTrue, styles.btnPicRapport] : [styles.btnPicTakenFalse, styles.btnPicRapport]}>
            <Text style={styles.photoTitle}>{isPicRapport ? 'Photo du rapport enregistrée' : 'Prendre une photo du rapport'}</Text>
          <Image source={require('../assets/camera_icon.png')} style={styles.img}/>
        </TouchableOpacity>
        <TouchableOpacity 
            onPress={isPicFacture ? ()=>{renderPhoto('facture')} : ()=>{navigation.navigate('CameraScreen', {type: 'photoInfos', numFolder: numFolder, picType: 'facture'})}} 
            style={isPicFacture ? [styles.btnPicTakenTrue, styles.btnPicFacture] : [styles.btnPicTakenFalse, styles.btnPicFacture]}>
            <Text style={styles.photoFactureTitle}>{isPicFacture ? 'Photo de la facture enregistrée' : 'Prendre une photo de la facture'}</Text>
          <Image source={require('../assets/camera_icon.png')} style={styles.imgFacture}/>
        </TouchableOpacity>
        <TouchableOpacity 
            onPress={isPicAutre ? ()=>{renderPhoto('autre')} : ()=>{navigation.navigate('CameraScreen', {type: 'photoInfos', numFolder: numFolder, picType: 'autre'})}} 
            style={isPicAutre ? [styles.btnPicTakenTrue, styles.btnPicAutre] : [styles.btnPicTakenFalse, styles.btnPicAutre]}>
            <Text style={styles.photoTitle}>{isPicAutre ? 'Autre photo enregistrée' : 'Prendre une autre photo'}</Text>
          <Image source={require('../assets/camera_icon.png')} style={styles.img}/>
        </TouchableOpacity>
        <TouchableOpacity 
            onPress={isRapportRempli ? ()=>{} : ()=>{}} 
            style={isRapportRempli ? [styles.btnPicTakenTrue, styles.btnRapport] : [styles.btnPicTakenFalse, styles.btnRapport]}>
            <Text style={styles.photoTitle}>{isRapportRempli ? 'Rapport rempli' : 'Remplir le rapport'}</Text>
          <Image source={require('../assets/report_icon.png')} style={styles.imgReport}/>
        </TouchableOpacity>
        {imageURI && <Image source={{uri: imageURI}} style={{flex:1}}/>}
      </View>
    );
  }

  const styles = StyleSheet.create({
    btnTxt:{
      top:10,
      fontSize: 18,
    fontFamily:'Roboto',
    color:'white'
  },
    modal:{
      width: '35%',
      height:'35%'
    },
    modalViewContainer:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00000020'
    },
    modalView:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF', 
      // padding: 20,
      width: '100%',
      height: '100%',
      borderRadius: 6,
      borderWidth:0.5
    },
    img: {
      width: 35,
      height: 28,
      left: '100%'
    },
    imgFacture: {
      width: 35,
      height: 28,
      left: '20%'
    },
    imgReport: {
      width: 33,
      height: 32,
      left: '115%'
    },
    photoPreview: {
      position:'relative',
      width: '100%',
      height: '100%',
    },
    btn: {
      position:'absolute', 
      left: 50, 
      top: 266,
      width: '50%',
      height: 35,
      zIndex: 200
    },
    btnPicTakenTrue: {
      borderWidth: 2,
      borderRadius: 8,
      borderColor: 'green',
      position:'absolute', 
      left: 40, 
      width: '80%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'lightgreen',
      marginTop: 10,
      marginBottom: 10
    },
    btnPicTakenFalse: {
      borderWidth: 2,
      borderRadius: 8,
      borderColor: 'blue',
      position:'absolute', 
      left: 40, 
      width: '80%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'skyblue',
      marginTop: 10,
      marginBottom: 10
    },
    btnPicDefault: { 
      top: 316
    },
    btnPicRapport: { 
      top: 366
    },
    btnPicFacture: { 
      top: 416
    },
    btnPicAutre: { 
      top: 466
    },
    btnRapport: {
      top: 586
    },
    wrapperInputDossier: {
      borderWidth: 2,
      borderRadius: 8,
      borderColor: 'grey',
      position:'absolute', 
      left: 40, 
      top: 46,
      width: '80%',
      flexDirection: 'row',
      alignItems: 'center'
    },
    wrapperInputConfieur: {
      borderWidth: 0.5,
      borderRadius: 5,
      borderColor: 'grey',
      position:'absolute', 
      // left: 50, 
      top: 126,
      width: '80%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    wrapperInputMarque: {
      borderWidth: 0.5,
      borderRadius: 5,
      borderColor: 'grey',
      position:'absolute', 
      // left: 50, 
      top: 176,
      width: '80%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    wrapperInputDesignation: {
      borderWidth: 0.5,
      borderRadius: 5,
      borderColor: 'grey',
      position:'absolute', 
      // left: 50, 
      top: 226,
      width: '80%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputTitle: {
      padding: 10,
      // width: '50%',
      fontSize: 16,
      fontWeight: 'bold'
    },
    input: {
      padding: 10,
      // width: '50%',
      fontSize: 16
    },
    photoTitle: {
      padding: 10,
      width: '70%',
      fontSize: 14
    },
    photoFactureTitle: {
      padding: 10,
      width: '80%',
      fontSize: 14
    },
    wrapperIcon: {
      position: 'absolute',
      right: 0,
      padding: 10,
    },
    icon: {
      width: 24,
      height: 24,
    },
    iconQRCode: {
      width: 48,
      height: 48
    }
  });

export { FolderScreen };
