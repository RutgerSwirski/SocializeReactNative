import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native'
import firebase from 'firebase'
import Moment from 'react-moment';
import { Actions } from 'react-native-router-flux'

class Invites extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			invites: [],
			currentUser: this.props.currentUser
		}
		// this.getUserInvites = this.getUserInvites.bind(this)
	}

	async componentDidMount() {
		this.mounted = true

		if (this.mounted) {
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
					}
				})
				this.getUserInvites()
			})
			.catch((error) => {
				console.log(error);
			})
		}
	}

	async getUserInvites() {
		if (this.mounted) {
			setInterval(() => 
				fetch("https://socialize-rn-api.herokuapp.com/api/v1/get_user_invites", {
				  method: 'POST',
				   headers: {
			         'Accept': 'application/json',
			         'Content-Type': 'application/json',
			       },
			       body: JSON.stringify({
			       	 user_id: this.state.currentUser.userID
			      })
			    })
				.then((response) => response.json())
				.then((responseText) => {
					this.setState({
						invites: responseText
					})
				})
				.catch((error) => {
					console.log(error);
				})
			,1000)
		}
	}

	listOfInvites() {
		if (this.state.invites && this.state.invites.length) {
			return this.state.invites.map((invite) => {
				return(
				    <View key={ invite.id } style={styles.inviteContainer}>
					    <TouchableOpacity onPress={ () => { Actions.showuser({userID: invite.sender.id}) } }>
					    	<Text style={styles.inviteSenderName}>{ invite.sender.first_name } { invite.sender.last_name }</Text>
					    </TouchableOpacity>
					    <Text style={{fontSize: 20}}>{invite.location}</Text>
					    <Moment element={Text} style={styles.inviteDate} format="DD/MM/YY hh:mm">{invite.date_time}</Moment>
				    	<View style={styles.acceptDeclineContainer}>
					    	<TouchableOpacity style={styles.acceptButtonContainer} onPress={ () => { this.acceptDeclineInvite(invite, 'accepted') }}>
					    		<Text style={styles.acceptButton}>Accept</Text>
					    	</TouchableOpacity>
					    	<TouchableOpacity style={styles.declineButtonContainer} onPress={ () => { this.acceptDeclineInvite(invite, 'declined') } }>
					    		<Text style={styles.declineButton}>Decline</Text>
					    	</TouchableOpacity>
				    	</View>
				    </View>
			    )
			})
		} else {
			return(
				<View style={styles.inviteContainer}>
					<Text style={styles.noInvitesText}>You have no new Invites! :(</Text>
				</View>

			)
		}
	}

	acceptDeclineInvite(invite, status) {
		fetch(`https://socialize-rn-api.herokuapp.com/api/v1/invites/${invite.id}`, {
		  method: 'PATCH',
		   headers: {
	         'Accept': 'application/json',
	         'Content-Type': 'application/json',
	       },
	       body: JSON.stringify({
	       	invite_id: invite.id,
	       	status: status
	      })
	    })
		.then((response) => response.json())
		.then((responseText) => {
			alert(`Invite ${status}`)
			if (status === 'accepted') {
				this.sendPushNotification(invite)
			}
		})
		.catch((error) => {
			console.log(error);
		})
	}

	sendPushNotification(invite) {
		fetch('https://exp.host/--/api/v2/push/send', {
			method: "POST",
			headers: {
	        	'Accept': 'application/json',
	        	'Content-Type': 'application/json',
	       	},
	       	body: JSON.stringify({
	       		to: invite.sender.notification_token,
	       		sound: 'default',
	       		title: 'New Meet',
	       		body: `${invite.reciever.first_name} accepted your Invite!`
	       	})
		})
	}

	componentWillUnmount() {
		this.mounted = false
	}

	render() {
		return(
			<SafeAreaView style={styles.container}>
				<ScrollView>
					<View style={styles.inviteTitleContainer}>
						<Text style={styles.inviteTitle}>Invites</Text>
					</View>
					<View>{ this.listOfInvites() }</View>
				</ScrollView>
			</SafeAreaView>

		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 50
	},
	inviteContainer: {
		paddingVertical: 15,
		paddingHorizontal: 50,
		marginVertical: 5
	},
	inviteTitleContainer: {
		borderBottomWidth: 1,
		paddingHorizontal: 15,
		paddingVertical: 15,
		marginHorizontal: 20
	},
	inviteTitle: {
		fontSize: 35,
		fontWeight: 'bold',
	},
	inviteSenderName: {
		fontSize: 24
	},
	inviteDate: {
		fontSize: 22,
		marginVertical: 10
	},
	acceptDeclineContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: 10
	},
	acceptButtonContainer: {
		backgroundColor: '#6666FF',
		paddingHorizontal: 25,
		paddingVertical: 12,
		borderRadius: 10
	},
	acceptButton: {
		fontSize: 20,
		color: 'white'
	},
	declineButtonContainer: {
		backgroundColor: '#FF3232',
		paddingHorizontal: 25,
		paddingVertical: 12,
		borderRadius: 10
	},
	declineButton: {
		fontSize: 20,
		color: 'white',
	},
	noInvitesText: {
		fontSize: 25,
		paddingVertical: 10,
		paddingHorizontal: 15,
	}
})

export default Invites