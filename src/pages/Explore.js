import React from 'react'
import { SafeAreaView, View, ScrollView, Text, StyleSheet, Platform, TouchableOpacity, Dimensions, Image, ListView } from 'react-native'
import { Actions } from 'react-native-router-flux'

import { Avatar } from 'react-native-elements'
import firebase from 'firebase'
import MapView from 'react-native-maps'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import { getDistance, convertDistance } from 'geolib'
import pluralize from 'pluralize'

import Helpers from '../components/Helpers'

class Explore extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			users: [],
			currentUser: {},
			locationReverse: {},
			mapView: true,
			showFilters: false
		}
	}

	// LOCAL -- http://localhost:3000/api/v1/users
	// HEROKU -- https://socialize-rn-api.herokuapp.com/api/v1/set_app_user

	componentDidMount() {
		const user = Helpers.getUser()
        .then((responseText) => {
          this.setState({
            currentUser: responseText
          })
        })
		this.getUsers()
	}

	async getUsers() {
		try {
            const userApiCall = await fetch('https://socialize-rn-api.herokuapp.com/api/v1/users')
            const users = await userApiCall.json()
            this.setState({ 
            	users: users 
            })
            // this.fetchProfilePics()
        } catch(error) {
            console.log(error.message)
        }
	}

	// async fetchProfilePics() {
	// 	this.state.users.map(async (user) => {
	// 		const ref = firebase.storage().ref().child(user.profilePicture)
	// 		const url = await ref.getDownloadURL();
	// 		const currentUser = {...user}
	// 		currentUser.profilePicture = url
	// 		this.setState({user})
	// 	})
	// }

	getUserDistance(user) {
		distance = getDistance(
		    { latitude: this.state.currentUser.latitude, longitude: this.state.currentUser.longitude },
		    { latitude: user.latitude, longitude: user.longitude }
		)
		return (
			<Text style={styles.userDistance}>{user.first_name} is {convertDistance(distance, 'mi').toFixed(1)} { pluralize('mile', distance.toFixed(0)) } away</Text>
		)
	}


	listOfUsers() {
		return this.state.users.map((user) => {
			if (user.id !== this.state.currentUser.id) {
				return(
					<View key={user.id} style={styles.userCardContainer}>
						<TouchableOpacity onPress={ () => { Actions.showuser({userID: user.id}) } }>
							<View style={styles.userCard}>
								<View style={styles.userCardImage}>
									<Avatar size="large" rounded source={{uri: 'https://images.unsplash.com/photo-1572926598340-edec895c4335?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80'}} />
								</View>
								<View style={styles.userCardTextContainer}>
									<Text style={styles.userCardName}>{user.first_name} {user.last_name}</Text>
									{this.getUserDistance(user)}
									<Text style={styles.userCardDescription}>{user.description}</Text>
								</View>
							</View>
						</TouchableOpacity>
					</View>
			    )
			}
		})
	}

	mapView() {
		if (this.state.currentUser.longitude !== undefined && this.state.currentUser.latitude !== undefined) {
			return(
				<View>
					<MapView style={styles.mapStyle} region={{latitude: this.state.currentUser.latitude, longitude: this.state.currentUser.longitude, latitudeDelta: 0.2000, longitudeDelta: 0.2000}} showsUserLocation={true}>
						{ this.state.users.map((user) => {
							if (user.id !== this.state.currentUser.id) {
								return (
									user.id !== this.state.currentUser.userID ? (
										<MapView.Marker key={user.id} coordinate={{longitude: user.longitude, latitude: user.latitude}}> 
											<MapView.Callout onPress={() => { Actions.showuser({userID: user.id}) }}>
												<View>
													<Text>{ user.first_name } { user.last_name }</Text>
												</View>
												<View>
													<Text>{ user.description }</Text>
												</View>
											</MapView.Callout>
										</MapView.Marker>) 
									: null
								)	
							}
						})}
					</MapView>
				</View>
			)
		}
	}

	listView() {
		return(
			<View style={styles.listViewContainer}>
				<TouchableOpacity onPress={() => { this.toggleFilter() } }>
					<Text>{this.state.showFilters ? 'hide' : 'show' } filters</Text>
				</TouchableOpacity>
				{ this.state.showFilters ? this.listViewFilters() : null }
		    	{ this.listOfUsers() }
		    </View>
		)
	}

	toggleFilter() {
		this.setState((prevState) => ({
			showFilters: !prevState.showFilters
		}))
	}

	listViewFilters() {
		return(
			<View>
				<Text>Filters</Text>
			</View>
		)
	}

	toggleMapView(state) {
		this.setState({
			mapView: state
		})
	}

	render() {
		return(
			<View style={styles.container}>
				<View style={styles.toggleViewContainer}>
					<TouchableOpacity style={styles.toggleButtonContainer} onPress={() => { this.toggleMapView(true) }}>
						<Text style={ this.state.mapView ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive }>Map View</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.toggleButtonContainer} onPress={() => { this.toggleMapView(false) }}>
						<Text style={ this.state.mapView ? styles.toggleButtonTextInactive : styles.toggleButtonTextActive }>Card View</Text>
					</TouchableOpacity>
				</View>
				<ScrollView>
					<View>{ this.state.mapView ? this.mapView() : this.listView() }</View>
				</ScrollView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 37,
		alignItems: 'center'
	},
	listViewContainer: {
		width: Dimensions.get('window').width
	},
	userCardContainer: {
		marginVertical: 5,
	},
	userCard: {
		paddingVertical: 10,
		paddingHorizontal: 10,
		flexDirection: 'row',
	},
	userCardImage: {
		marginTop: 5
	},
	userCardTextContainer: {
		justifyContent: 'center',
		marginLeft: 25,
	},
	userCardName: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	userCardDescription: {
		paddingRight: 15,
		fontSize: 14,
		width: 300
	},
	mapStyle: {
		width: Dimensions.get('window').width,
    	height: Dimensions.get('window').height,
	},
	toggleViewContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%'
	},
	toggleButtonContainer: {
		paddingVertical: 15,
	},
	toggleButtonTextActive: {
		fontSize: 18,
	},
	toggleButtonTextInactive: {
		fontSize: 18,
		opacity: 0.2
	},
	userDistance: {
		fontSize: 14,
		marginVertical: 5,
		fontWeight: '500'
	}
})

export default Explore