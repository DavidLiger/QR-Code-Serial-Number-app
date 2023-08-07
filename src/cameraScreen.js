import React, { useState, useEffect } from 'react';
import { BackHandler, StyleSheet ,Text, View, Modal, Image, TouchableOpacity} from 'react-native';
import { Camera } from 'expo-camera';
import { useWindowDimensions } from "react-native";
import * as ImageManipulator from 'expo-image-manipulator';

function CameraScreen({ navigation, route  }) {

    const {width} = useWindowDimensions();
    const {height} = useWindowDimensions();
    const cameraHeight = Math.round((width * 16) / 9);
    const btnHeight = (height - cameraHeight) /2;

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [imageURI, setImageURI] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [modalVisible, setModalVisible] = useState(false);
    const [numFolder, setNumFolder] = useState('');
    const [picType, setPicType] = useState('');

    function handleBackButtonClick() {
        navigation.navigate('Dossier');
        return true;
    }

    useEffect(() => {
        
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
            
        })();
        if(route.params?.type == 'photoInfos'){{
            setNumFolder(route.params?.numFolder)
            setPicType(route.params?.picType)
          }}
        //bouton back
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
    }, [route.params?.type]);

    const setImgData = async () => {
        let imgData = {
            order: 'setImgForFolder',
            numFolder: numFolder,
            imgType: picType,
            base64Img: imageBase64
          }
          fetch('https://test.api.909services.com/uploadPhoto.php', {
            method: 'POST',
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: `Bearer `
            },
            body: JSON.stringify(imgData)
          })
          .then((response) => response.text())
          .then((responseText) => {
            console.log(responseText); 
            if(responseText){
                navigation.navigate('Dossier', {type: picType, isTransmitted: true})
            }else{
                alert('Probleme de transmission de l\'image')
            }
          })
    }

    const takePicture = async () => {
        if(camera){
            const data = await camera.takePictureAsync({base64: true})
            await ImageManipulator.manipulateAsync(
                data.uri,
                [{ resize: { width: data.width * 0.5, height: data.height * 0.5 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
              ); 
            setImageURI(data.uri);
            setImageBase64(data.base64)
            setModalVisible(true)
        }
    }

    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
    <View style={{ flex: 1}}>
        <Modal
        style={styles.modal}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
        //   Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
            <View style={styles.modalViewContainer}>
                <View style={styles.modalView}>
                    <Image source={{uri:imageURI}} style={styles.img}/>
                    <TouchableOpacity
                        onPress={()=>{
                            setImgData()
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
                        >Enregistrer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{
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
        <View style={styles.cameraContainer}>
                <Camera 
                ref={ref => setCamera(ref)}
                type={type}
                ratio="16:9"
                style={{
                  height: cameraHeight,
                  width: "100%"
                }}
                />
        </View>
        <View style={{
            height: btnHeight*2.6,
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent:'center',
            backgroundColor: '#7dcc96'
        }}>
            <TouchableOpacity 
                onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                        );
                    }}
                style={{
                    width:'70%',
                    height:btnHeight,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent:'center',
                    backgroundColor: '#3d2663',
                    borderRadius: 8
                }}>
                <Text
                    style = {styles.cameraBtnTxt}
                >{type == Camera.Constants.Type.back ? "Caméra Arrière" : "Caméra Avant"}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => takePicture()}
                style={{
                    width:'70%',
                    height:btnHeight,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent:'center',
                    backgroundColor: '#3d2663',
                    borderRadius: 8,
                    marginTop: 5
                }}>
                <Text
                    style = {styles.cameraBtnTxt}
                >Prendre la photo</Text>
            </TouchableOpacity>
        </View>
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
        width: '100%',
        height:'100%'
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
    cameraContainer: {
        // flex: 1,
        flexDirection: 'row'
    },
    img: {
        position:'relative',
      width: '100%',
      height: '100%',
    },
    cameraBtnContainer: {
      height: 50,
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent:'center',
      backgroundColor: 'skyblue'
    },
    cameraBtnTxt:{
      fontSize: 18,
      fontFamily:'Roboto',
      color:'white'
    }
})

export { CameraScreen }