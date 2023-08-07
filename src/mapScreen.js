import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

function MapScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Map Screen</Text>
        <TouchableOpacity title="Go back" onPress={() => navigation.goBack()} style={styles.btn}>
          <Image source={require('../assets/go_back_arrow.png')} style={styles.img}/>
        </TouchableOpacity>
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
    }
  });

export { MapScreen };
