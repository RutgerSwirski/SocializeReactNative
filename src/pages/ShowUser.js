import React from 'react'
import { KeyboardAvoidingView, SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Platform , ActivityIndicator, Modal, TouchableHighlight, Button, Alert, ScrollView, Dimensions, TextInput, Picker } from 'react-native'
import { Avatar } from 'react-native-elements'
import firebase from 'firebase'
import { Actions } from 'react-native-router-flux'

import { Icon } from 'react-native-elements'
import DateTimePicker from "react-native-modal-datetime-picker"
import moment from "moment";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import MapView from 'react-native-maps'
import * as Location from 'expo-location'

import Helpers from '../components/Helpers'

class ShowUser extends React.Component {
	updateUserReviewIntervalID = 0;
	constructor() {
		super()
		this.state = {
			user: [],
			userReviews: [],
			showInviteUserModal: false,
			isDateTimePickerVisible: false,
			showMapArea: false,
			showGoogleLocationSearch: false,
			invite: {
				datetime: new Date(),
				longitude: null,
				latitude: null,
				location: ''
			},
			currentUser: {},
			review: {
				rating: 1,
				description: ''
			},
			loading: true
		}
		this.setDate = this.setDate.bind(this)
		this.hideDatePicker = this.hideDatePicker.bind(this)
		this.submitMeetDetails = this.submitMeetDetails.bind(this)
		this.sendPushNotification = this.sendPushNotification.bind(this)
	}

	async componentDidMount() {
		this._isMounted = true
		const user = Helpers.getUser()
        .then((responseText) => {
          this.setState({
            currentUser: responseText
          })
        })
		try { 
			this.updateUserReviewIntervalID = setInterval(async() => {
	            const userApiCall = await fetch(`https://socialize-rn-api.herokuapp.com/api/v1/users/${this.props.userID}`)
	            const user = await userApiCall.json()
	            .then((response) => {
		            this.setState({ 
		            	user: response.user,
		            	userReviews: response.user_reviews,
		            	loading: false
		            })
	            })	
			}, 1000)
            if (this.state.user.profilePicture !== null) {
            	this.fetchProfilePic()
            }
            this.pickLocationFromMap()
        } catch(error) {
            console.log(error.message)
        }
	}

	componentWillUnmount() {
		clearInterval(this.updateUserReviewIntervalID)
	}

	async fetchProfilePic() {
		// const ref = firebase.storage().ref().child(this.state.user.profilePicture)
		// const url = await ref.getDownloadURL();
		// const currentUser = {...this.state.user}
		// currentUser.profilePictureURL = url
		// this.setState({user})
	}

	setDate(datetime) {
		var invite = {...this.state.invite}
		invite.datetime = datetime
		this.setState({invite})
		this.hideDatePicker()
	}

	hideDatePicker() {
		this.setState({ 
			isDateTimePickerVisible: false 
		})
	}

	submitMeetDetails() {
		if ( moment(this.state.invite.datetime).isAfter(new Date()) ) {
			fetch(`https://socialize-rn-api.herokuapp.com/api/v1/users/${this.state.currentUser.id}/invites`, {
			  method: 'POST',
			   headers: {
		         'Accept': 'application/json',
		         'Content-Type': 'application/json',
		       },
		       body: JSON.stringify({
		       	sender_id: this.state.currentUser.id,
		       	reciever_id: this.state.user.id,
		       	datetime: this.state.invite.datetime,
		       	location: this.state.invite.location,
		       	longitude: this.state.invite.longitude,
		       	latitude: this.state.invite.latitude
		      })
		    })
			.then(() => { 
				Alert.alert('Invite Sent',`Invite sent to ${this.state.user.first_name}`, [ { text: 'OK', onPress: () => { this.setState({ showInviteUserModal: false })}}])
				this.sendPushNotification()
			})
			.catch((error) => {
				alert(error)
			})
		} else {
			alert('Date and Time must be in the future!')
		}
	}

	sendPushNotification() {
		fetch('https://exp.host/--/api/v2/push/send', {
			method: "POST",
			headers: {
	        	'Accept': 'application/json',
	        	'Content-Type': 'application/json',
	       	},
	       	body: JSON.stringify({
	       		to: this.state.user.notification_token,
	       		sound: 'default',
	       		title: 'New Invite',
	       		body: 'You have a new Invite!'
	       	})
		})
	}

	inviteUserModal() {
		return(
			<Modal animationType="slide" transparent={ false } visible={ this.state.showInviteUserModal } onRequestClose={() => { alert('Modal has been closed.') }}>
				<ScrollView>
					<View style={styles.closeModal}>
						<TouchableOpacity onPress={() => { this.setState({ showInviteUserModal: false }) }}>
		                	<Icon name="close" size={35} />
		              	</TouchableOpacity>
					</View>
					<View style={styles.modalContainer}>
						<View style={styles.modalContentContainer}>
							<Text style={styles.inviteTitle}>Invite {this.state.user.first_name} to meet</Text>
							<Text style={styles.currentDateTime}>Date and Time Picked:</Text>
							<Text style={styles.currentDateTime}>{ moment(this.state.invite.datetime).format('MMMM Do YYYY, h:mm a') }</Text>
							<Text style={styles.locationPicked}>Location Picked: {this.state.invite.location}</Text>
							<TouchableOpacity onPress={ () => { this.setState({ isDateTimePickerVisible: true })} } style={styles.pickDateTimeContainer}>
								<Text style={styles.pickDateTime}>Pick Date and Time</Text>
							</TouchableOpacity>
							<DateTimePicker mode="datetime" isVisible={this.state.isDateTimePickerVisible} onConfirm={ this.setDate } onCancel={ this.hideDatePicker } />

							<View>
								<TouchableOpacity style={styles.showSearchAreaContainer} onPress={() => { this.setState((prevState) => ({ showGoogleLocationSearch: !prevState.showGoogleLocationSearch }) ) }}>
									<Text style={styles.showSearchAreaText}>{ this.state.showGoogleLocationSearch ? 'Hide Search Area' : 'Search for a Location' }</Text>
								</TouchableOpacity>
							</View>

							{this.state.showGoogleLocationSearch ? this.googleLocationSearch() : null}

							<View>
								<TouchableOpacity style={styles.showMapAreaContainer} onPress={() => { this.setState((prevState) => ({ showMapArea: !prevState.showMapArea }) ) }}>
									<Text style={styles.showMapAreaText}>{ this.state.showMapArea ? 'Hide Map Area' : 'Pick Location From Map' }</Text>
								</TouchableOpacity>
							</View>

							{this.state.showMapArea ? this.pickLocationFromMap() : null}

							<View>
								<TouchableOpacity onPress={ this.submitMeetDetails } style={styles.submitDateTimeContainer}>
									<Text style={styles.submitDateTime}>Submit</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</ScrollView>
       		</Modal>
		)
	}

	googleLocationSearch() {
		return(
			<GooglePlacesAutocomplete
		      placeholder='Search'
		      minLength={2} // minimum length of text to search
		      autoFocus={false}
		      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
		      keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
		      listViewDisplayed='auto'    // true/false/undefined
		      fetchDetails={true}
		      renderDescription={row => row.description} // custom description render
		      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
		        var invite = {...this.state.invite}
		        invite.longitude = details.geometry.location.lng
		        invite.latitude = details.geometry.location.lat
				invite.location = data.description
				this.setState({invite})
		      }}

		      getDefaultValue={() => ''}

		      query={{
		        key: 'AIzaSyASG5tyzFE4-eG5_naW4M2P88SQY5SRU3k',
		        language: 'en',
		        types: '(cities)'
		      }}

		      styles={{
		        textInputContainer: {
		          width: '100%'
		        },
		        description: {
		          fontWeight: 'bold'
		        },
		        predefinedPlacesDescription: {
		          color: '#1faadb'
		        },
		      }}
		    />
		)
	}

	pickLocationFromMap() {
		if (this.state.currentUser.longitude !== undefined && this.state.currentUser.latitude !== undefined) {
			return(
				<View>
					<MapView style={styles.customMeetLocationMap} region={this.state.invite.longitude ? {latitude: this.state.invite.latitude, longitude: this.state.invite.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0922} : {latitude: this.state.currentUser.latitude, longitude: this.state.currentUser.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0922}} showsUserLocation={true}>
						<MapView.Marker draggable coordinate={this.state.invite.longitude ? {latitude: this.state.invite.latitude, longitude: this.state.invite.longitude} : {latitude: this.state.currentUser.latitude, longitude: this.state.currentUser.longitude}} 
						onDragEnd={(e) => { 
							var invite = {...this.state.invite}
							invite.longitude = e.nativeEvent.coordinate.longitude
							invite.latitude = e.nativeEvent.coordinate.latitude
							reverseLocation = Location.reverseGeocodeAsync({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude })
								.then((response) => { 
									var invite = {...this.state.invite}
									invite.location = `${response[0].name} ${response[0].street}, ${(response[0].city === null) ? '' : response[0].city + ','} ${response[0].region}, ${response[0].postalCode}` 
									this.setState({invite}) 
								})
								.catch((error) => { console.log(error) })
							this.setState({invite})
						}} />
					</MapView>
				</View>
			)
		}
	}

	inviteUserButton() {
		return(
			<View style={styles.inviteUserContainer}>
				<TouchableOpacity style={styles.inviteButtonContainer} onPress={ () => { this.setState({ showInviteUserModal: true })}}>
					<Text style={styles.inviteButton}>Invite User to Meet</Text>
				</TouchableOpacity>
			</View>
		)
	}


	userReviewContainer() {
		return(
			<View style={styles.userReviewContainer}>
				<Text style={styles.userReviewTitle}>Leave a review about { this.state.user.first_name }</Text>
				<Text>Rating:</Text>
				<Picker
				  selectedValue={this.state.review.rating}
				  style={{height: 50, width: 100}}
				  onValueChange={(itemValue) => {
				    var review = {...this.state.review}
					review.rating = itemValue
					this.setState({review})
				  }}>
				  	<Picker.Item label="1" value={1} />
		            <Picker.Item label="2" value={2} />
		            <Picker.Item label="3" value={3} />
		            <Picker.Item label="4" value={4} />
		            <Picker.Item label="5" value={5} />
				</Picker>
				<Text style={{marginVertical: 10}}>Description:</Text>
				<TextInput style={styles.descriptionInput} numberOfLines={10} multiline={true}
					onChangeText={
						(description) => {
							var review = {...this.state.review}
							review.description = description
							this.setState({review})
						}
					}
          			value={ this.state.review.description }  
      			/>
      			<TouchableOpacity onPress={ () => { this.submitReview() } }>
      				<Text>Submit Review</Text>
      			</TouchableOpacity>
			</View>
		)
	}

	submitReview() {
		fetch(`https://socialize-rn-api.herokuapp.com/api/v1/users/${this.state.user.id}/reviews`, {
		  method: 'POST',
		   headers: {
	         'Accept': 'application/json',
	         'Content-Type': 'application/json',
	       },
	       body: JSON.stringify({
	       	rating: this.state.review.rating,
	       	description: this.state.review.description,
	       	reviewer_id: this.state.currentUser.id,
	       	reviewee_id: this.state.user.id
	      })
	    })
		.then(() => { 
			alert('Review Sent')
			this.sendReviewPushNotification()
			var review = {...this.state.review}
			review.description = ''
			this.setState({review}) 
		})
		.catch((error) => {
			alert(error)
		})
	}

	listOfUserReviews() {
		return this.state.userReviews.map((review) => {
			return(
			    <View key={review.id} style={styles.reviewContainer}>
					<Text style={styles.reviewText}>{ review.rating }</Text>
					<Text style={styles.reviewText}>{ review.description }</Text>
				</View>
		    )
		})
	}

	sendReviewPushNotification() {
		fetch('https://exp.host/--/api/v2/push/send', {
			method: "POST",
			headers: {
	        	'Accept': 'application/json',
	        	'Content-Type': 'application/json',
	       	},
	       	body: JSON.stringify({
	       		to: this.state.user.notification_token,
	       		sound: 'default',
	       		title: 'New Review',
	       		body: 'You have a new Review!'
	       	})
		})
	}

	render() {
		if (this.state.loading) {
			return (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			)
		} else {
			return(
				// {uri: this.state.user.profilePictureURL}
				<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
					<ScrollView>
						{ this.state.showInviteUserModal ? this.inviteUserModal() : null }
						<View style={styles.avatarContainer}>
							<Avatar size="xlarge" rounded source={{uri: 'https://images.unsplash.com/photo-1572926598340-edec895c4335?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80'}} />
						</View>
							<View>
								<Text style={styles.profileName}>{this.state.user.first_name} {this.state.user.last_name}</Text>
								<Text style={styles.profileDescription}>{this.state.user.description}</Text>
							</View>
						{ this.inviteUserButton() }

						<View style={styles.reviewsContainer}>
							{ this.listOfUserReviews() }
						</View>

						{ this.userReviewContainer() }
					</ScrollView>
				</KeyboardAvoidingView>
			)
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 40
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
	inviteUserContainer: {
		alignItems: 'center',
		marginVertical: 25
	},
	inviteButtonContainer: {
		width: '60%',
		paddingHorizontal: 30,
		paddingVertical: 10,
		backgroundColor: '#6666FF',
		borderRadius: 10,
	},
	inviteButton: {
		textAlign: 'center',
		fontSize: 20,
		color: 'white'
	},
	modalContainer: {
		flex: 1,
	},
	closeModal: {
		flexDirection: 'row',
		marginLeft: 15,
		marginTop: 50
	},
	modalContentContainer: {
		alignItems: 'center',
		marginTop: 15
	},
	inviteTitle: {
		fontSize: 30,
	},
	currentDateTime: {
		fontSize: 23,
		marginTop: 10
	},
	pickDateTimeContainer: {
		borderRadius: 10,
		backgroundColor: '#6666FF',
		paddingVertical: 10,
		paddingHorizontal: 25,
		marginVertical: 10
	},
	pickDateTime: {
		fontSize: 18,
		color: 'white'
	},
	submitDateTimeContainer: {
		borderRadius: 10,
		backgroundColor: '#6666FF',
		paddingVertical: 10,
		paddingHorizontal: 25
	},
	submitDateTime: {
		fontSize: 18,
		color: 'white'
	},
	pickLocationContainer: {
		borderRadius: 10,
		backgroundColor: '#6666FF',
		paddingVertical: 10,
		paddingHorizontal: 25,
		marginVertical: 20
	},
	pickLocation: {
		fontSize: 18,
		color: 'white'
	},
	locationPicked: {
		marginVertical: 10,
		fontSize: 25
	},
	customMeetLocationMap: {
		height: 500,
		width: Dimensions.get('window').width
	},
	showMapAreaContainer: {
		backgroundColor: '#052F5F',
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginVertical: 10,
		borderRadius: 15
	},
	showMapAreaText: {
		fontSize: 18,
		color: 'white'
	},
	showSearchAreaContainer: {
		backgroundColor: '#320E3B',
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginVertical: 10,
		borderRadius: 15
	},
	showSearchAreaText: {
		fontSize: 14,
		color: 'white'
	},
	userReviewContainer: {
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
	userReviewTitle: {
		fontSize: 18
	},
	reviewsContainer: {
		alignItems: 'center'
	},
	reviewContainer: {
		paddingHorizontal: 10,
		marginVertical: 5,
		paddingVertical: 15,
		backgroundColor: '#6666FF',
		width: 300,
		borderRadius: 5
	},
	reviewText: {
		color: 'white',
		fontSize: 15
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent:'center'
	}
})


export default ShowUser