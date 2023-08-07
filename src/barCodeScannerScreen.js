import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity , Image} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';

function BarCodeScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const goToFolderWithCode = async ({data}) => {
    navigation.navigate('Dossier', {type: 'numFolder', numFolder: data})
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity title="Go back" onPress={() => navigation.goBack()} style={styles.btn}>
          <Image source={require('../assets/go_back_arrow.png')} style={styles.img}/>
        </TouchableOpacity>
      {isFocused ? (
        <BarCodeScanner
          onBarCodeScanned={goToFolderWithCode}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  barCodeView: {
    width: '100%', 
    height: '50%', 
    marginBottom: 40
  },
});

export {BarCodeScannerScreen}