import React from 'react'

import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import Helpers from '../components/Helpers'

class ShowInvite extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showDirections: false,
			directionsMethod: 'DRIVING',
			currentUser: {},
			invite: this.props.invite,
			tripDuration: 0,
			loading: true
		}
	}

	componentDidMount() {
		const user = Helpers.getUser()
        .then((responseText) => {
          this.setState({
            currentUser: responseText,
            loading: false
          })
        })
	}


	showDirectionMethods() {
		return (
			<View style={styles.directionMethodsContainer}>
				<TouchableOpacity onPress={() => { this.updateDirections('DRIVING') }}>
					<Text style={this.state.directionsMethod === 'DRIVING' ? styles.methodActive : styles.methodInactive}>Driving</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={ () => { this.updateDirections('BICYCLING')} }>
					<Text style={this.state.directionsMethod === 'BICYCLING' ? styles.methodActive : styles.methodInactive}>Biking</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={ () => { this.updateDirections('WALKING') } }>
					<Text style={this.state.directionsMethod === 'WALKING' ? styles.methodActive : styles.methodInactive}>Walking</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => { this.updateDirections('TRANSIT') } }>
					<Text style={this.state.directionsMethod === 'TRANSIT' ? styles.methodActive : styles.methodInactive}>Public Transport</Text>
				</TouchableOpacity>
			</View>
		)
	}

	updateDirections(method) {
		this.setState({
			directionsMethod: method
		})
	}

	showTripDuration() {
		const tripDays = (this.state.tripDuration / 1440).toFixed(0)
		const tripHours = (this.state.tripDuration / 60) | 0
		const tripMinutes = (this.state.tripDuration - (tripHours * 60)).toFixed(0)
		if (this.state.tripDuration === 0) {
			return(
				<Text style={styles.loadingText}>Calculating...</Text>
			)
		} else {
			return(
				<View style={styles.centerItems}>
					<Text style={styles.tripDurationText}>{tripDays} Days, {tripHours} Hours, {tripMinutes} Minutes</Text>
				</View>
			)
		}
	}

	render() {
		const origin = {latitude: this.state.currentUser.latitude, longitude: this.state.currentUser.longitude}
		const destination = {latitude: this.state.invite.latitude, longitude: this.state.invite.longitude}
		const GOOGLE_MAPS_APIKEY = 'AIzaSyASG5tyzFE4-eG5_naW4M2P88SQY5SRU3k'
		if (this.state.loading) {
			return(
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			)
		} else {
			return(
				<ScrollView style={styles.container}>
					<Text style={styles.title}>Your Invite with {this.state.invite.sender.id === this.state.currentUser.id ? this.state.invite.reciever.first_name : this.state.invite.sender.first_name }</Text>
					<MapView style={styles.inviteMeetupMap} region={this.state.currentUser.latitude === undefined ? { longitude: 0, latitude: 0, latitudeDelta: 0.2000, longitudeDelta: 0.2000 } : { latitude: this.state.currentUser.latitude, longitude: this.state.currentUser.longitude, latitudeDelta: 0.2000, longitudeDelta: 0.2000 }} showsUserLocation={true}>
						<MapView.Marker key={this.state.invite.id} coordinate={{longitude: this.state.invite.longitude, latitude: this.state.invite.latitude}} /> 
						{ this.state.showDirections ? 
							<MapViewDirections origin={origin} destination={destination} apikey={GOOGLE_MAPS_APIKEY} strokeWidth={3} mode={this.state.directionsMethod}
								onReady={(result) => {
									this.setState({
										tripDuration: result.duration
									})
		 						}}
						 	/> : null }
					</MapView>
					{ this.state.showDirections ? this.showDirectionMethods() : null }
					{ this.state.showDirections ? this.showTripDuration() : null }
					<View style={styles.centerItems}>
						<TouchableOpacity style={styles.directionButtonContainer} onPress={ () => { this.setState((prevState) => ({ showDirections: !prevState.showDirections })) } }>
							<Text style={styles.directionButtonText}>{this.state.showDirections ? 'Hide' : 'Show' } Directions</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			)
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 36,
	},
	title: {
		textAlign: 'center',
		fontSize: 30,
		marginVertical: 20
	},
	inviteMeetupMap: {
		height: 500,
		width: Dimensions.get('window').width
	},
	directionButtonContainer: {
		marginVertical: 15,
		alignItems: 'center',
		paddingVertical: 10,
		backgroundColor: '#545e75',
		borderRadius: 10,
		width: 250
	},
	directionButtonText: {
		color: 'white',
		textAlign: 'center',
		fontSize: 15
	},
	centerItems: {
		alignItems: 'center'
	},
	directionMethodsContainer: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-around',
		marginVertical: 5
	},
	methodActive: {
		fontSize: 20
	},
	methodInactive: {
		fontSize: 15,
		opacity: 0.3
	},
	tripDurationText: {
		fontSize: 20,
		marginVertical: 10
	},
	loadingText: {
		textAlign: 'center',
		fontSize: 20,
		marginVertical: 10
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent:'center'
	}
})


export default ShowInvite