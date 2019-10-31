import React from 'react'

import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import firebase from 'firebase'

class Settings extends React.Component {
	handleLogOut() {
		firebase.auth().signOut()
	    	.then(() => {
	    		Actions.reset('loginsignup')
	    	}, (error) => {
	    		alert(error.message)
	    	});
	}

	render() {
		return(
			<View style={styles.container}>
				<Text>Settings</Text>
				<TouchableOpacity onPress={ this.handleLogOut } style={styles.logOutButtonContainer}>
					<Text style={styles.logOutButton}>Logout</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 40 : 35
	},
	logOutButtonContainer: {
		paddingVertical: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	logOutButton: {
		color: 'red',
		fontSize: 20,
	}
})

export default Settings