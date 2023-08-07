import 'react-native-gesture-handler';
import 'react-native-reanimated';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/homeScreen';
import { PlanningScreen } from './src/planningScreen';
import { WorkshopScreen } from './src/workshopScreen';
import { FolderScreen } from './src/folderScreen';
import { MapScreen } from './src/mapScreen';
import { SettingsScreen } from './src/settingsScreen';
import { AccountScreen } from './src/accountScreen';
import { LoginScreen } from './src/loginScreen';
import { SplashScreen } from './src/splashScreen';
import { BarCodeScannerScreen } from './src/barCodeScannerScreen';
import { CameraScreen } from './src/cameraScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Image } from 'react-native';

const Drawer = createDrawerNavigator();

function Root() {
  return (
    <Drawer.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#7dcc96',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        marginLeft: 30
      },
    }}>
      <Drawer.Screen name="App 909" component={HomeScreen} options={{
           title: 'App 909',
           drawerIcon: ({focused, size}) => (
            <Image
              source={require('./assets/logo_icon.png')}
              style={styles.icon}
            />
           ),
        }}/>
      <Drawer.Screen name="Planning" component={PlanningScreen} options={{
           title: 'Planning',
           drawerIcon: ({focused, size}) => (
            <Image
              source={require('./assets/planning_icon.png')}
              style={styles.icon}
            />
           ),
        }}/>
      <Drawer.Screen name="Atelier" component={WorkshopScreen} options={{
           title: 'Atelier',
           drawerIcon: ({focused, size}) => (
            <Image
              source={require('./assets/workshop_icon.png')}
              style={styles.icon}
            />
           ),
        }}/>
      <Drawer.Screen name="Map" component={MapScreen} options={{
           title: 'Map',
           drawerIcon: ({focused, size}) => (
            <Image
              source={require('./assets/map_icon.png')}
              style={styles.icon}
            />
           ),
        }}/>
      <Drawer.Screen name="Paramètres" component={SettingsScreen} options={{
           title: 'Paramètres',
           drawerIcon: ({focused, size}) => (
            <Image
              source={require('./assets/settings_icon.png')}
              style={styles.icon}
            />
           ),
        }}/>
      <Drawer.Screen name="Compte" component={AccountScreen} options={{
           title: 'Compte',
           drawerIcon: ({focused, size}) => (
            <Image
              source={require('./assets/account_icon.png')}
              style={styles.icon}
            />
           ),
        }}/>
    </Drawer.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#7dcc96',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Stack.Screen name="Root" component={Root} options={{ headerShown: false }} />
        <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="App 909" component={HomeScreen} options={{ title: 'App 909' }}/>
        <Stack.Screen name="Planning" component={PlanningScreen} />
        <Stack.Screen name="Atelier" component={WorkshopScreen} />
        <Stack.Screen name="Dossier" component={FolderScreen} options={{ headerBackVisible: false }}/>
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Paramètres" component={SettingsScreen}/>
        <Stack.Screen name="BarCodeScannerScreen" component={BarCodeScannerScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 35,
    height: 35
  }
});


export default App;
