import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

function HomeScreen({ navigation }) {
    return (
      <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: 150 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Planning')} style={styles.btn}>
            <Image source={require('../assets/planning_btn.png')} style={styles.img}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Atelier')} style={styles.btn}>
            <Image source={require('../assets/workshop_btn.png')} style={styles.img}/>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Map')} style={styles.btn}>
            <Image source={require('../assets/map_btn.png')} style={styles.img}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Paramètres')} style={styles.btn}>
            <Image source={require('../assets/settings_btn.png')} style={styles.img}/>
          </TouchableOpacity>
        </View>
      </View>
      
    );
  }

  const styles = StyleSheet.create({
    img: {
      width: 150,
      height: 150
    },
    btn: {
      width: 150,
      height: 150,
      margin: 15
    }
  });

export { HomeScreen };
