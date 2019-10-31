import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

import firebase from 'firebase'
import { Actions } from 'react-native-router-flux'


class Home extends React.Component {
	handleLogOut() {
		firebase.auth().signOut()
	    	.then(() => {
	    		Actions.reset('loginCheck')
	    	}, (error) => {
	    		alert(error.message)
	    	});
	}

	render() {
		const user = firebase.auth().currentUser
		return(
			<View style={styles.container}>
				<Text style={styles.helloText}>Hello, {user.email}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#6666FF',
	    flex: 1,
	    alignItems: 'center',
	    paddingVertical: 150,
	},
	helloText: {
		color: 'white',
		fontSize: 20
	}
})

export default Home