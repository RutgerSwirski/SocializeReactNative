import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, SafeAreaView, Dimensions, Alert, ActivityIndicator} from 'react-native'

import firebase from 'firebase'
import { Actions } from 'react-native-router-flux'
import { Avatar } from 'react-native-elements'
import Moment from 'react-moment'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo'

import moment from 'moment'

import Helpers from '../components/Helpers'

class Home extends React.Component {
	acceptedInvitesIntervalID = 0;
	constructor() {
		super()
		this.state = {
			currentUser: {},
			acceptedInvites: {},
			loading: true
		}
	}

	async getAcceptedUserInvites() {
	  this.acceptedInvitesIntervalID = setInterval(() => 
	    fetch("https://socialize-rn-api.herokuapp.com/api/v1/get_accepted_user_invites", {
	      method: 'POST',
	       headers: {
	           'Accept': 'application/json',
	           'Content-Type': 'application/json',
	         },
	         body: JSON.stringify({
	           user_id: this.state.currentUser.id
	        })
	      })
	    .then((response) => response.json())
	    .then((responseText) => {
	      this.setState({
	        acceptedInvites: responseText,
	        loading: false
	      })
	    })
	    .catch((error) => {
	      console.log(error);
	    })
	  ,1000)
  	}


	// cancelButton(invite, inviteFirstName) {
	// 	Alert.alert(
	// 	  'Cancel Meet',
	// 	  `Are you sure you want to cancel your meet with ${ inviteFirstName }`,
	// 	  [
	// 	    {text: 'OK', onPress: () => { this.cancelMeet(invite) }},
	// 	    {
	// 	      text: 'Cancel',
	// 	      style: 'cancel',
	// 	    },
	// 	  ],
	// 	  {cancelable: false},
	// 	)
	// }

	// cancelMeet(invite) {
	// 	fetch(`https://socialize-rn-api.herokuapp.com/api/v1/invites/${invite.id}`, {
	// 	  method: 'PATCH',
	// 	   headers: {
	//          'Accept': 'application/json',
	//          'Content-Type': 'application/json',
	//        },
	//        body: JSON.stringify({
	//        	invite_id: invite.id,
	//        	status: 'canceled'
	//       })
	//     })
	// 	.then((response) => response.json())
	// 	.then((responseText) => {
	// 		alert('Invite Canceled')
	// 		this.sendCancelMeetPushNotification(invite)
	// 	})
	// 	.catch((error) => {
	// 		console.log(error);
	// 	})
	// }
	// sendCancelMeetPushNotification(invite) {
	// 	fetch('https://exp.host/--/api/v2/push/send', {
	// 		method: "POST",
	// 		headers: {
	//         	'Accept': 'application/json',
	//         	'Content-Type': 'application/json',
	//        	},
	//        	body: JSON.stringify({
	//        		to: (invite.sender.id === this.state.currentUser.id) ? invite.reciever.notification_token : invite.sender.notification_token,
	//        		sound: 'default',
	//        		title: 'Meet Canceled',
	//        		body: `${(invite.sender.id === this.state.currentUser.id) ? invite.reciever.first_name : invite.sender.first_name} had to cancel a meet! :(`
	//        	})
	// 	})
	// }



	componentDidMount() {
		const user = Helpers.getUser()
        .then((responseText) => {
          this.setState({
            currentUser: responseText
          })
          Helpers.getLocation(this.state.currentUser)
        })
		const userLocation = Helpers.getLocation(this.state.currentUser)
        .then((responseText) => {
			var currentUser = {...this.state.currentUser}
			currentUser.longitude = responseText.longitude
			currentUser.latitude = responseText.latitude
			this.setState({currentUser})
        })

        this.registerForPushNotificationsAsync()
		this.getAcceptedUserInvites()
	}

	componentWillUnmount() {
		clearInterval(this.acceptedInvitesIntervalID)
	}


	async registerForPushNotificationsAsync() {
	  const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      )
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
        finalStatus = status
      }

      if (finalStatus !== 'granted') {
        return
      }

      let token = await Notifications.getExpoPushTokenAsync()

      fetch(`https://socialize-rn-api.herokuapp.com/api/v1/users/${this.state.currentUser.id}`, {
        method: 'PATCH',
         headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
            notification_token: token
          })
        })
      .then((response) => {
        // Nothing
      })
      .catch((error) => {
        alert(error)
      })
	}

	listOfInvites() {
		return this.state.acceptedInvites.map((invite) => {
			// Setting Times //////////////////////////////////////////
			var inviteDate = moment(invite.date_time)
			var dateNow = moment(new Date())
			var diffDays = inviteDate.diff(dateNow, 'days')
			var diffHours = inviteDate.diff(dateNow, 'hours')
			diffHours = (diffHours - diffDays*24)
			var diffMinutes = inviteDate.diff(dateNow, 'minutes')
			diffMinutes = diffMinutes - (diffDays*24*60 + diffHours*60)
			///////////////////////////////////////////////////////////
			if (invite.sender.id === this.state.currentUser.id) {
				return(
				    <View key={ invite.id } style={styles.inviteCardContainer}>
					    <TouchableOpacity onPress={() => { Actions.showuser({userID: invite.reciever.id })}}>
					    	<View style={styles.nameAvatarContainer}>
						    	<View>
						    		<Avatar size="large" rounded source={{uri: 'https://images.unsplash.com/photo-1572926598340-edec895c4335?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80'}} />
						    	</View>
						    	<View style={styles.inviteSenderNameContainer}>
						    		<Text style={styles.inviteSenderName}>{ invite.reciever.first_name } { invite.reciever.last_name }</Text>
						    	</View>
					    	</View>
					    </TouchableOpacity>
					    <View style={styles.inviteTimerContainer}>
					   		<Text style={styles.inviteTimerText}>{diffDays} Days {diffHours} Hours {diffMinutes} Minutes</Text>
					    </View>
				    	<View style={styles.buttonContainer}>
				    		<TouchableOpacity style={styles.viewInviteButtonContainer} onPress={ () => { Actions.showinvite({invite: invite, currentUser: this.state.currentUser})} }>
				    			<Text style={styles.viewInviteButton}>View Invite</Text>
				    		</TouchableOpacity>
				    	</View>
				    </View>
				)
			} else {
				return(
					<View key={ invite.id } style={styles.inviteCardContainer}>
					    <TouchableOpacity onPress={() => { Actions.showuser({userID: invite.sender.id })}}>
					    	<View style={styles.nameAvatarContainer}>
						    	<View>
						    		<Avatar size="large" rounded source={{uri: 'https://images.unsplash.com/photo-1572926598340-edec895c4335?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80'}} />
						    	</View>
						    	<View style={styles.inviteSenderNameContainer}>
						    		<Text style={styles.inviteSenderName}>{ invite.sender.first_name } { invite.sender.last_name }</Text>
						    	</View>
					    	</View>
					    </TouchableOpacity>
					    <View style={styles.inviteTimerContainer}>
					   		<Text style={styles.inviteTimerText}>{diffDays} Days {diffHours} Hours {diffMinutes} Minutes</Text>
					    </View>
				    	<View style={styles.buttonContainer}>
				    		<TouchableOpacity style={styles.viewInviteButtonContainer} onPress={ () => { Actions.showinvite({invite: invite, currentUser: this.state.currentUser})} }>
				    			<Text style={styles.viewInviteButton}>View Invite</Text>
				    		</TouchableOpacity>
				    	</View>
				    </View>
			    )
			}
		})
	}
				

	helloText() {
		var today = new Date()
		var curHr = today.getHours()
		return (
			<View style={styles.helloTextContainer}>
				<Text style={styles.helloText}>{curHr < 12 ? 'Good Morning' : curHr < 18 ? 'Good Afternoon' : 'Good Evening'} {this.state.currentUser.first_name}</Text>
			</View>
		)
	}

	render() {
		if (this.state.loading) {
			return(
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			)
		} else {
			return(
				<ScrollView style={styles.container}>
						{ this.helloText() }
						<Text style={styles.upcomingMeetsText}>Upcoming Meets</Text>
						<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
							{ this.listOfInvites() }
						</ScrollView>
						<Text>Users Near you ATM</Text>
						<Text>Recent Reviews about Users near you</Text>
						<Text>Recent meets in your area</Text>
				</ScrollView>
			)
		}
	}
}

const styles = StyleSheet.create({
	container: {
	    flex: 1,
	    marginTop: 37
	},
	helloTextContainer: {
		marginVertical: 15
	},
	helloText: {
		fontSize: 30,
		paddingVertical: 15,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	upcomingMeetsText: {
		fontSize: 25,
		textAlign: 'center',
		marginVertical: 15,
		fontWeight: '600'
	},
	inviteCardContainer: {
		width: 300,
		borderRadius: 15,
	    marginHorizontal: 15,
	    paddingHorizontal: 10,
	    backgroundColor: '#5887ff'
	},
	nameAvatarContainer: {
		alignItems: 'center',
		paddingVertical: 15,
		borderBottomWidth: 0.5,
		borderColor: 'white'
	},
	inviteSenderNameContainer: {
		paddingTop: 15,

	},
	inviteSenderName: {
		fontSize: 21,
		color: 'white',
		// fontWeight: 'bold'
	},
	inviteDateLocationContainer: {
		alignItems: 'center',
		paddingVertical: 5,
	},
	inviteDate: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
	},
	inviteLocation: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
	},
	inviteTimerContainer: {
		marginVertical: 10,
		paddingHorizontal: 10
	},
	inviteTimerText: {
		fontSize: 22,
		color: 'white',
		fontWeight: '500',
		textAlign: 'center'
	},
	buttonContainer: {
		marginVertical: 10
	},
	viewInviteButtonContainer: {
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: '#1c77c3'
	},
	viewInviteButton: {
		textAlign: 'center',
		color: 'white',
		fontSize: 17,
		fontWeight: '500'
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent:'center'
	},
})

export default Home