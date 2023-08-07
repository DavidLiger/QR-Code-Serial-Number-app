import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';



function WorkshopScreen({ navigation }) {
  const [numFolder, setNumFolder] = useState('');

  const getFolder = () => {
    navigation.navigate('Dossier', {type: 'numFolder', numFolder: numFolder})
  }

  const scanQRCode = () => {
    navigation.navigate('BarCodeScannerScreen')
  }


    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity title="Go back" onPress={() => navigation.navigate('App 909')} style={styles.btn}>
          <Image source={require('../assets/go_back_arrow.png')} style={styles.img}/>
        </TouchableOpacity>
        <View style={styles.wrapperInput}>
          <TextInput
            style={styles.input}
            placeholder="numéro de dossier"
            // value={numFolderSearched}
            onChangeText={(text) => setNumFolder(text)}
            onSubmitEditing={() => getFolder()}
          />
          <TouchableOpacity
            style={styles.wrapperIcon}
            onPress={() => getFolder()}
          >
              <Image 
              source={require('../assets/magnifier_icon_small.png')} 
              style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.wrapperIconQRCode} onPress={scanQRCode} >
              <Image 
              source={require('../assets/barQRCode_borderRadius.png')} 
              style={styles.iconQRCode} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    img: {
      width: 35,
      height: 35
    },
    btn: {
      position:'absolute', 
      left: 50, 
      top: -46,
      width: 35,
      height: 35,
      zIndex: 200
    },
    wrapperInput: {
      borderWidth: 2,
      borderRadius: 8,
      borderColor: 'grey',
      position:'absolute', 
      left: 40, 
      top: 46,
      width: 244,
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
    wrapperIcon: {
      position: 'absolute',
      right: 0,
      padding: 10,
    },
    wrapperIconQRCode: {
      position: 'absolute',
      left: 258,
      // top:-10,
      padding: 1,
      // borderWidth: 2,
      borderRadius: 12,
      // borderColor: 'grey',
    },
    icon: {
      width: 24,
      height: 24,
    },
    iconQRCode: {
      width: 52,
      height: 52
    }
  });

export { WorkshopScreen };
