import React from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux'
import { Text } from 'react-native'
import Loading from './src/pages/Loading'
import LoginSignUp from './src/pages/LoginSignUp'
import Login from './src/pages/Login'
import SignUp from './src/pages/SignUp'
import Home from './src/pages/Home'
import Explore from './src/pages/Explore'
import Profile from './src/pages/Profile'
import Settings from './src/pages/Settings'
import initializeFireBase from './src/Config'

import firebase from 'firebase'

const TabIcon = ({selected, title}) => {
  return(
    <Text style={{color: selected ? 'black' : 'blue'}}>Add Icon</Text>
  )
}

class App extends React.Component {
  constructor() {
    super()
    initializeFireBase();
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        Actions.reset('tabBar')
      } else {
        Actions.reset('loginsignup')
      }
    });
  }

  render() {
    return(
      <Router>
        <Scene key="root">
          <Scene key="loading" component={ Loading } title="loading" initial hideNavBar={true} />
          <Scene key="loginsignup" component={ LoginSignUp } title="loginsignup" hideNavBar={true} />
          <Scene key="login" component={ Login } title="login" hideNavBar={true} /> 
          <Scene key="signup" component={ SignUp } title="signup" hideNavBar={true} />
          <Scene key="settings" component={ Settings } title="settings" hideNavBar={true} />
            <Scene key="tabBar" tabs={true} hideNavBar tabBarStyle={{backgroundColor: 'white'}}>
              <Scene key="home" title="Home" icon={TabIcon} component={ Home } hideNavBar={true} />
              <Scene key="explore" title="Explore" icon={TabIcon} component={ Explore } hideNavBar={true} />
              <Scene key="profile" title="Profile" icon={TabIcon} component={ Profile } hideNavBar={true} />
            </Scene>
        </Scene>
      </Router>
    )
  }
}

export default App
