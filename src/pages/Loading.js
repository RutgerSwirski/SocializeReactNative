import React from 'react'

import { View, StyleSheet, ActivityIndicator, Text } from 'react-native'

class Loading extends React.Component {
	render() {
		return(
			<View style={styles.container}>
				<ActivityIndicator size="large" color="black" />
				<Text style={styles.loadingText}>Loading...</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
	    flex: 1,
	    alignItems: 'center',
	    justifyContent: 'center'
	},
	loadingText: {
		fontSize: 18,
		marginVertical: 10
	}
})

export default Loading