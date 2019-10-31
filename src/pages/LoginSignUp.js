import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import firebase from 'firebase'

import SocializeLogo from '../../assets/Socialize-Logo.png'
import { Actions } from 'react-native-router-flux'

class LoginSignUp extends React.Component {
	render() {
		return(
			<View style={styles.container}>
				<Image source={SocializeLogo} style={styles.logo}/>
				<View style={styles.buttonContainer}>
					<TouchableOpacity onPress={ Actions.login }>
						<Text style={styles.signInUpButton}>Sign In</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={ Actions.signup }>
						<Text style={styles.signInUpButton}>Sign Up</Text>
					</TouchableOpacity>
				</View>
			</View>
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
  buttonContainer: {
  	flexDirection: 'row',
  	width: '100%',
  	justifyContent: 'space-around',
  	marginVertical: 50
  },
  signInUpButton: {
  	fontSize: 25,
  	color: 'white',
  	borderWidth: 1,
  	borderRadius: 5,
  	paddingVertical: 5,
  	paddingHorizontal: 25,
  	borderColor: 'white'
  },
  logo: {
  	width: 160,
  	height: 160,
  }
})

export default LoginSignUp