import React from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import firebase from 'firebase'

import { Actions } from 'react-native-router-flux'

class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			email: '',
			password: ''
		}
		this.handleLogin = this.handleLogin.bind(this)
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
	
	render() {
		return(
			<View style={styles.container}>
				<Text style={styles.text}>Login</Text>
				<View style={styles.textInputContainer}>
				<TextInput placeholder="Email..." placeholderTextColor="white" style={styles.textInput} 
					onChangeText={email => this.setState({
							email: email 
						})}
          			value={ this.state.email }  
          		/>
				</View>
				<View style={styles.textInputContainer}>
					<TextInput secureTextEntry={true} placeholder="Password..." placeholderTextColor="white" style={styles.textInput}
						onChangeText={password => this.setState({
							password: password
						})}
						value={ this.state.password }
					/>
				</View>
				<TouchableOpacity onPress={ this.handleLogin }>
					<Text style={styles.loginButton}>Login</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6666FF',
    flex: 1,
    alignItems: 'center',
    paddingVertical: 150
  },
  text: {
  	color: 'white',
  	fontSize: 45,
  	marginVertical: 20
  },
  textInputContainer: {
  	marginVertical: 10,
  	marginHorizontal: 60,
  	flexDirection: 'row'

  },
  textInput: {
  	borderWidth: 1,
  	paddingVertical: 10,
  	paddingHorizontal: 20,
  	fontSize: 20,
  	borderColor: 'white',
  	borderRadius: 10,
  	color: 'white',
  	flex: 1,
  },
  loginButton: {
  	marginVertical: 10,
  	borderWidth: 1,
  	borderColor: 'white',
  	borderRadius: 10,
  	color: 'white',
  	paddingVertical: 10,
  	paddingHorizontal: 40,
  	fontSize: 20
  }
})

export default Login