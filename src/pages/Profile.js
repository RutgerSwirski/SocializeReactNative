import React from 'react'
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Platform , ActivityIndicator, Image, Modal, TextInput, ScrollView } from 'react-native'
import { Avatar } from 'react-native-elements';
import firebase from 'firebase'

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Actions } from 'react-native-router-flux'

import { Icon } from 'react-native-elements'

import Helpers from '../components/Helpers'

class Profile extends React.Component {
	constructor() {
		super()
		this.state = {
			currentUser: {},
			showEditDescription: false
		}
	}

	// HEROKU -- https://socialize-rn-api.herokuapp.com/api/v1/set_app_user
	// LOCAL -- http://localhost:3000/api/v1/set_app_user

	componentDidMount() {
		const user = Helpers.getUser()
        .then((responseText) => {
          this.setState({
            currentUser: responseText
          })
        })
	}

	goToSettings() {
		Actions.settings()
	}

	async fetchProfilePic() {
		// if (this.state.currentUser.profilePicture !== null) {
			// const ref = firebase.storage().ref().child(this.state.currentUser.profilePicture)
			// console.log(ref)
			// const url = await ref.getDownloadURL();
			// const currentUser = {...this.state.currentUser}
			// currentUser.profilePictureURL = url
			// this.setState({currentUser})
		// }
	}

	componentWillUnmount() {
		this.mounted = false
	}

	editDescription() {
		return(
			<View style={styles.editDescriptionAreaContainer}>
				<TextInput style={styles.descriptionInput} numberOfLines={10} multiline={true}
					onChangeText={
						(description) => {
							var currentUser = {...this.state.currentUser}
							currentUser.description = description
							this.setState({currentUser})
						}
					}
          			value={ this.state.currentUser.description }  
      			/>
			</View>
		)
	}

	EditSaveDescription() {
		if (this.state.showEditDescription) {
			return (
				<TouchableOpacity style={styles.editDescriptionButtonContainer} onPress={ () => { this.saveUpdatedDescription() } }>
					<Text style={styles.editDescriptionText}>Save Description</Text>
				</TouchableOpacity>
			)
		} else {
			return (
				<TouchableOpacity style={styles.editDescriptionButtonContainer} onPress={() => { this.setState((prevState) => ({ showEditDescription: !prevState.showEditDescription })) }}>
					<Text style={styles.editDescriptionText}>Edit Description</Text>
				</TouchableOpacity>
			)
		}
	}

	saveUpdatedDescription() {
		this.setState((prevState) => ({ 
			showEditDescription: !prevState.showEditDescription 
		}))
		fetch(`https://socialize-rn-api.herokuapp.com/api/v1/users/${this.state.currentUser.id}`, {
		  method: 'PATCH',
		   headers: {
	         'Accept': 'application/json',
	         'Content-Type': 'application/json',
	       },
	       body: JSON.stringify({
	       	description: this.state.currentUser.description
	      })
	    })
		.then((response) => {
			// Nothing //
		})
		.catch((error) => {
			alert(error)
		})
	}

	render() {
		return(
			<SafeAreaView style={styles.container}>
				<View style={styles.titleContainer}>
					<TouchableOpacity onPress={ () => { this.goToSettings() } } style={styles.settingsButtonContainer}>
						<Icon name='settings' size={30} />
					</TouchableOpacity>
				</View>
				<ScrollView>

					<View style={styles.avatarContainer}>
						<Avatar size="xlarge" rounded source={{uri: this.state.currentUser.profilePictureURL}} />
					</View>
					
					<View>
						<Text style={styles.profileName}>{this.state.currentUser.first_name} {this.state.currentUser.last_name}</Text>
						{ this.state.showEditDescription ? this.editDescription() : <Text style={styles.profileDescription}>{this.state.currentUser.description}</Text> }
					</View>
					<View style={styles.editDescriptionContainer}>
						{ this.EditSaveDescription() }
					</View>
				</ScrollView>
			</SafeAreaView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 40 : 35,
	},
	titleContainer: {
		paddingVertical: 10,
		flexDirection: 'row-reverse'
	},
	settingsButtonContainer: {
		marginRight: 30,
		marginTop: 5
	},
	avatarContainer: {
		alignItems: 'center',
		marginVertical: 15
	},
	profileName: {
		fontSize: 30,
		textAlign: 'center',
		marginVertical: 15
	},
	profileDescription: {
		textAlign: 'center',
		fontSize: 20,
		marginHorizontal: 15,
	},
	editDescriptionContainer: {
		alignItems: 'center'
	},
	editDescriptionButtonContainer: {
		fontSize: 14,
		backgroundColor: '#052F5F',
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 20
	},
	editDescriptionText: {
		color: 'white'
	},
	editDescriptionAreaContainer: {
		alignItems: 'center'
	},
	descriptionInput: {
    	justifyContent: "flex-start",
    	borderWidth: 0.5,
    	borderColor: '#D3D3D3',
		paddingHorizontal: 10,
		paddingVertical: 10,
		width: 300,
		height: 150,
		textAlignVertical: 'top',
		fontSize: 20,
		marginHorizontal: 15,
		marginVertical: 15
	},
})


export default Profile