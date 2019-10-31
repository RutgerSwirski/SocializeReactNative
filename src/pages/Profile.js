import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { ImagePicker } from 'expo'
import firebase from 'firebase'

import { Actions } from 'react-native-router-flux'


class Profile extends React.Component {
	goToSettings() {
		Actions.settings()
	}
	render() {
		return(
			<View style={styles.container}>
				<View style={styles.titleContainer}>
					<Text style={styles.title}>Profile</Text>
					<TouchableOpacity onPress={ this.goToSettings } style={styles.settingsButtonContainer}>
						<Text style={styles.settingsButton}>Settings</Text>
					</TouchableOpacity>
				</View>
			</View>

		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 40 : 35
	},
	titleContainer: {
		flexDirection: 'row',
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10,
	},
	title: {
		fontSize: 25,
		marginLeft: 20,
	},
	settingsButtonContainer: {
		marginRight: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	settingsButton : {
		paddingVertical: 5,
		paddingHorizontal: 15,
		fontSize: 15
	}
})


export default Profile