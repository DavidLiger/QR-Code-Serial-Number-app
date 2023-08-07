import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

function SplashScreen({navigation}) {
  useEffect(() => {
    setTimeout(() => {
      handleGetToken();
    }, 2000);
  });

  const fetchPayload = async (token) => {
    const response = await fetch(
      "https://test.api.909services.com/auth/auth.php", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${token}`
        }
      }
    )
    const data = await response.text()
    return data
  }

  const handleGetToken = async () => {
    const dataToken = await AsyncStorage.getItem('AccessToken');
    if (!dataToken) {
        console.log('pas de token');
      navigation.replace('Login');
    } else {
      //A RE-COMMENTER !!!
        // AsyncStorage.clear();
        try {
            const payload = await fetchPayload(dataToken)
            navigation.replace('Root');
          } catch (error) {
            console.error('Problem', error)
          }
    }
  };

  return (
    <View style={ styles.container }>
      <Image source={require('../assets/splashScreen.png')} style={styles.backgroundImage}>
      </Image>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
      flex: 1,
      // resizeMode: 'cover', // or 'stretch'
      height: '100%', 
      width: '100%'
  },
  loginForm: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
  },
});

export { SplashScreen };
