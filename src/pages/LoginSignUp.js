import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native'
import firebase from 'firebase'
import SocializeLogo from '../../assets/Socialize-Logo.png'
import { Actions } from 'react-native-router-flux'
import { KeyboardAvoidingView } from 'react-native'

class LoginSignUp extends React.Component {
  constructor() {
    super()
    this.state = {
      showLogin: true,
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleSignUp = this.handleSignUp.bind(this)
  }


  showLogin() {
    return(
      <View style={styles.loginSignUpContainer}>
        <View style={styles.textInputContainer}>
        <TextInput placeholder="Email..." style={styles.textInput} 
          onChangeText={email => this.setState({
              email: email 
            })}
                value={ this.state.email }  
              />
        </View>
        <View style={styles.textInputContainer}>
          <TextInput secureTextEntry={true} placeholder="Password..." style={styles.textInput}
            onChangeText={password => this.setState({
              password: password
            })}
            value={ this.state.password }
          />
        </View>
        <TouchableOpacity onPress={ this.handleLogin }>
          <Text style={styles.loginSignUpButton}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    )
  }


  showSignUp() {
    return(
      <View style={styles.loginSignUpContainer}>
        <View style={styles.textInputContainer}>
          <TextInput placeholder="First Name..."style={styles.textInput}
            onChangeText={firstName => this.setState({
              first_name: firstName
            })}
            value={ this.state.first_name }
          />
        </View>
        <View style={styles.textInputContainer}>
          <TextInput placeholder="Last Name..." style={styles.textInput}
            onChangeText={lastName => this.setState({
              last_name: lastName
            })}
            value={ this.state.last_name }
          />
        </View>

        <View style={styles.textInputContainer}>
          <TextInput placeholder="Email..." style={styles.textInput}
            onChangeText={email => this.setState({
              email: email
            })}
            value={ this.state.email }
          />
        </View>
        <View style={styles.textInputContainer}>
          <TextInput secureTextEntry={true} placeholder="Password..." style={styles.textInput}
            onChangeText={password => this.setState({
              password: password
            })}
            value={ this.state.password }
          />
        </View>
        <View style={styles.textInputContainer}>
          <TextInput secureTextEntry={true} placeholder="Password Confirmation..." style={styles.textInput}
            onChangeText={passwordConfirmation => this.setState({
              passwordConfirmation: passwordConfirmation
            })}
            value={ this.state.passwordConfirmation }
          />
        </View>
        <TouchableOpacity onPress={ this.handleSignUp }>
          <Text style={styles.loginSignUpButton}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    )
  }

  toggleSignUpLogin(state) {
    this.setState({
      showLogin: state
    })
  }

  handleLogin() {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          firebase.auth().onAuthStateChanged(user => {
            })
        }, (error) => {
          alert(error.message)
        });
  }

  handleSignUp() {
    if (this.state.password === this.state.passwordConfirmation) {
        const lowerCaseEmail = this.state.email.toLowerCase()
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
          fetch("https://socialize-rn-api.herokuapp.com/api/v1/users", {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               email: lowerCaseEmail,
               first_name: this.state.first_name,
               last_name: this.state.last_name
            })
          })
          firebase.auth().onAuthStateChanged(user => {
          })
        }, (error) => {
          alert(error.message)
        })
    } else {
      alert('Passwords Must Match')
    }
  }


	render() {
		return(
			<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.logoContainer}>
  				<Image source={SocializeLogo} style={styles.logo}/>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => { this.toggleSignUpLogin(true)} }>
            <Text style={this.state.showLogin ? styles.buttonActive : styles.buttonInactive}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => { this.toggleSignUpLogin(false)} }>
            <Text style={this.state.showLogin ? styles.buttonInactive : styles.buttonActive}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        { this.state.showLogin ? this.showLogin() : this.showSignUp() }
			</KeyboardAvoidingView>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6666FF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {

  },
  logo: {
  	width: 160,
  	height: 160,
  },
  buttonsContainer: {
  	flexDirection: 'row',
    marginVertical: 20,
  },
  buttonContainer: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center'
  },
  buttonActive: {
    color: 'white',
    fontSize: 25,
  },
  buttonInactive: {
    color: 'white',
    fontSize: 25,
    opacity: 0.5
  },
  loginSignUpContainer: {
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: '80%',
    backgroundColor: 'white'
  },
  textInput: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 17,
    borderRadius: 10,
    marginVertical: 5
  },
  loginSignUpButton: {
    marginVertical: 10,
    backgroundColor: '#a682ff',
    paddingVertical: 15,
    color: 'white',
    borderRadius: 10,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  }
})

export default LoginSignUp