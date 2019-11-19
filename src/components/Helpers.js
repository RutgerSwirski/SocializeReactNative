import React from 'react'
import firebase from 'firebase'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import { Notifications } from 'expo';

export default {
	getUser: () => {
		return fetch("https://socialize-rn-api.herokuapp.com/api/v1/set_app_user", {
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
        .catch((error) => {
          console.log(error)
        })
  	},
  	getLocation: async (currentUser) => {
	  let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        console.log('Error')
      }
      let location = await Location.getCurrentPositionAsync({});
      return fetch("https://socialize-rn-api.herokuapp.com/api/v1/update_user_location", {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          longitude: location.coords.longitude,
          latitude: location.coords.latitude
        })
      })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      })
  	},
 //    getCurrentUserCity: async (currentUser) => {
	// 	const locationReverse = await Location.reverseGeocodeAsync({latitude: parseFloat(currentUser.latitude), longitude: parseFloat(currentUser.longitude)})
	// 	this.setState({
	// 		locationReverse: {
	// 			name: locationReverse[0].name,
	// 			street: locationReverse[0].street,
	// 			city: locationReverse[0].city,
	// 			postalCode: locationReverse[0].postalCode,
	// 			region: locationReverse[0].region,
	// 			isoCountryCode: locationReverse[0].isoCountryCode
	// 		}
	// 	})
	// }
}