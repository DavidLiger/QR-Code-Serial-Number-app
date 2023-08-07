import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [seePassword, setSeePassword] = useState(true);
  const [checkValidEmail, setCheckValidEmail] = useState(false);
  const [isUser, setIsUser] = useState(true);
  const [checkPassword, setCheckPassword] = useState(true);
  const [fPwWarning, setFPwWarning] = useState('Mot de passe incorrect');
  const [isWarned, setIsWarned] = useState(false);

  const handleCheckEmail = text => {
    let re = /\S+@\S+\.\S+/;
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    setEmail(text);
    if (re.test(text) || regex.test(text)) {
      setCheckValidEmail(false);
    } else {
      setCheckValidEmail(true);
    }
  };

  // REFAIRE tout en POST correct avec token dans le bearer (comme splashScreen)
  const fetchLogin = async () => {
    let dataInHeaders = {
      email: email.toLocaleLowerCase(),
      password: password
    }
    const response = await fetch(
      "https://test.api.909services.com/auth/login.php", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${JSON.stringify(dataInHeaders)}`
        }
      }
    )
    const data = await response.json()
    console.log('status_message : '+data.status_message);
    return data
  }

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

  const fetchFPassword = async () => {
    let dataInHeaders = {
      jwt: AsyncStorage.getItem('AccessToken'),
      email: email.toLocaleLowerCase(),
    }
    const response = await fetch(
      "https://test.api.909services.com/auth/renewPw.php", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${JSON.stringify(dataInHeaders)}`
        }
      }
    )
    const data = await response.json()
    console.log('status_message : '+data.status_message);
    // console.log(data);
    return data
  }

  const handleLogin = async () => {
    try {
      const login = await fetchLogin()
      switch (login.status_message){
        case 'User Found':
          setIsUser(true);
          setCheckPassword(true);
          AsyncStorage.setItem('AccessToken', login.data);
          let payload = await fetchPayload(login.data)
          payload = JSON.parse(payload)
          if(payload.email == email){
            navigation.replace('Root');
          }
        case 'User Not Found':
          setIsUser(false);
        case 'Wrong password':
          setCheckPassword(false);
      } 

    } catch (error) {
      console.error('Problem', error)
    }
  };

  const handleForgottenPassword = async () => {
    try {
      const fPw = await fetchFPassword()
      if(fPw.status_message == 'Mail Sent'){
        setFPwWarning('Un message de reconnexion a été envoyé dans votre boite mail : '+email)
        setIsWarned(true)
      }
    } catch (error) {
      console.error('Problem : ', error)
    }
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapperInput}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => handleCheckEmail(text)}
        />
      </View>
      {checkValidEmail ? (
        <Text style={styles.textFailed}>Wrong format email</Text>
      ) : (
        <Text style={styles.textFailed}> </Text>
      )}
      <View style={styles.wrapperInput}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry={seePassword}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity
          style={styles.wrapperIcon}
          onPress={() => setSeePassword(!seePassword)}>
          <Image 
          source={seePassword ? 
            require('../assets/Eye.png') : 
            require('../assets/EyeActive.png')} 
          style={styles.icon} />
        </TouchableOpacity>
      </View>
      {email == '' || password == '' || checkValidEmail == true ? (
        <TouchableOpacity
          disabled
          style={styles.buttonDisable}
          onPress={handleLogin}>
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.logButton} onPress={handleLogin}>
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
      )}
      {isUser ? (
        <Text style={styles.textFailed}> </Text>
      ) : (
        <Text style={styles.textFailed}>Vous n'êtes pas enregistré en tant que collaborateur 909</Text>
      )}
      {checkPassword ? (
        <Text style={styles.textFailed}> </Text>
      ) : (
        <View>
          <Text style={isWarned ? styles.textSuccess : styles.textFailed}>{fPwWarning}</Text>
          <TouchableOpacity style={styles.fpwButton} onPress={handleForgottenPassword}>
            <Text style={styles.text}>Mot de passe oublié</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  wrapperInput: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'grey',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    width: '100%',
  },
  wrapperIcon: {
    position: 'absolute',
    right: 0,
    padding: 10,
  },
  icon: {
    width: 30,
    height: 24,
  },
  logButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3d2663',
    borderRadius: 5,
    marginTop: 25,
  },
  fpwButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#80c394',
    borderRadius: 5,
    marginTop: 10,
    width: '50%',
    float: 'right',
    marginLeft: '50%'
  },
  buttonDisable: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 5,
    marginTop: 25,
  },
  text: {
    color: 'white',
    fontWeight: '700',
  },
  textFailed: {
    alignSelf: 'flex-end',
    color: 'red',
  },
  textSuccess: {
    alignSelf: 'flex-end',
    color: '#699eee',
  }
});

export { LoginScreen };
