import React from 'react'

import { View, StyleSheet, ActivityIndicator } from 'react-native'

class Loading extends React.Component {
	render() {
		return(
			<View style={styles.container}>
				<ActivityIndicator size="large" color="black" />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#6666FF',
	    flex: 1,
	    alignItems: 'center',
	    justifyContent: 'center'
	}
})

export default Loading