import React from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux'
import { Text, StyleSheet } from 'react-native'
import Loading from './src/pages/Loading'
import LoginSignUp from './src/pages/LoginSignUp'
import Home from './src/pages/Home'
import Explore from './src/pages/Explore'
import Profile from './src/pages/Profile'
import Settings from './src/pages/Settings'
import ShowUser from './src/pages/ShowUser'
import Invites from './src/pages/Invites'
import ShowInvite from './src/pages/ShowInvite'
import initializeFireBase from './src/Config'

import firebase from 'firebase'
import { Icon, Badge } from 'react-native-elements'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { View } from 'react-native'

import Helpers from './src/components/Helpers'

const TabIcon = ({title}) => {
  switch(title) {
      case 'Home':
        return <Icon name='home' />
      case 'Explore':
        return <Icon name='gps-fixed' />
      case 'Invites':
        return (
          <View>
            <Icon name='mail' />
          </View>
        )
      case 'Profile':
        return <FontAwesome5 name={'user'} style={styles.tabIcon} />
      default:
        return null;
    }
}

class App extends React.Component {
  constructor() {
    super()
    initializeFireBase()
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        Actions.reset('tabBar')
      } else {
        Actions.reset('loginsignup')
      }
    })
  }

  render() {
    return(
      <Router>
        <Scene key="root">
          <Scene key="loading" component={ Loading } title="loading" hideNavBar={true} />
          <Scene key="loginsignup" component={ LoginSignUp } title="loginsignup" hideNavBar={true} />
          <Scene key="settings" component={ Settings } title="Settings" />
          <Scene key="showuser" component={ShowUser } title="Profile" hideNavBar={true} />
          <Scene key="showinvite" component={ ShowInvite } title="Invite" hideNavBar={true} /> 
            <Scene key="tabBar" tabs={true} hideNavBar tabBarStyle={{backgroundColor: 'white'}}>
              <Scene key="home" title="Home" icon={TabIcon} component={ Home } hideNavBar={true} />
              <Scene key="explore" title="Explore" icon={TabIcon} component={ Explore } hideNavBar={true} />
              <Scene key="invites" title="Invites" icon={TabIcon} component={ Invites } hideNavBar={true} />
              <Scene key="profile" title="Profile" icon={TabIcon} component={ Profile } hideNavBar={true}  />
            </Scene>
        </Scene>
      </Router>
    )
  }
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  }
})

export default App
