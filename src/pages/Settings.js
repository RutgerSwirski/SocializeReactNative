import React from 'react'

import { View, Text, StyleSheet, Platform, TouchableOpacity, Modal, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'
import firebase from 'firebase'

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

class Settings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			currentUser: this.props.currentUser,
			showEditNameModal: false
		}
		this.uploadImage = this.uploadImage.bind(this)
	}

	async componentDidMount() {
		fetch("https://socialize-rn-api.herokuapp.com/api/v1/set_app_user", {
		  method: 'POST',
		   headers: {
	         'Accept': 'application/json',
	         'Content-Type': 'application/json',
	       },
	       body: JSON.stringify({
	       	 email: firebase.auth().currentUser.email
	      })
	    })
		.then((response) => response.json())
		.then((responseText) => {
			this.setState({
				currentUser: {
					userID: responseText.id,
					email: responseText.email
				}
			})
		})
		.catch((error) => {
			console.log(error);
		});
	}

	handleLogOut() {
		firebase.auth().signOut()
    	.then(() => {
    		Actions.reset('loginsignup')
    	}, (error) => {
    		alert(error.message)
    	})
	}

	async uploadImage() {
		await Permissions.askAsync(Permissions.CAMERA_ROLL);
		let result = await ImagePicker.launchImageLibraryAsync();
		const response = await fetch(result.uri);
		const blob = await response.blob(); 
		var ref = firebase.storage().ref().child(this.state.currentUser.email + '_profile_picture')
		fetch(`https://socialize-rn-api.herokuapp.com/api/v1/users/${this.state.currentUser.userID}`, {
		  method: 'PATCH',
		   headers: {
	         'Accept': 'application/json',
	         'Content-Type': 'application/json',
	       },
	       body: JSON.stringify({
	       	 profile_picture_url: (this.state.currentUser.email + '_profile_picture')
	      })
	    })
		.then((response) => {
			alert('Upload Successful')
		})
		.catch((error) => {
			alert(error)
		});
		return ref.put(blob)
	}


	render() {
		return(
			<View style={styles.container}>
				<TouchableOpacity onPress={ this.uploadImage } style={styles.buttonContainer}>
						<Text style={styles.updateProfilePicButton}>Update Profile Picture</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={ this.handleLogOut } style={styles.buttonContainer}>
					<Text style={styles.logOutButton}>Logout</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	buttonContainer: {
		paddingVertical: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	updateProfilePicButton: {
		fontSize: 20,
	},
	logOutButton: {
		color: 'red',
		fontSize: 20,
	}
})

export default Settings