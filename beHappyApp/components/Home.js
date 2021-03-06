import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import getEnvVars from '../environment';
const { ec2 } = getEnvVars();

import Main from './Main';
import LoginContainer from '../containers/LoginContainer';
import Signup from './Sign/SignUp';
import EntryCenter from './Center/EntryCenter';
import UserPreference from './Sign/UserPreference';
import SpecialtyPreference from './Sign/SpecialtyPreference';

const Stack = createStackNavigator();
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    this.checkUser = this.checkUser.bind(this);
    this.changeLoading = this.changeLoading.bind(this);
    this.getCenterInfo = this.getCenterInfo.bind(this);
    this.getUserBasicInfo = this.getUserBasicInfo.bind(this);
  }

  componentDidMount() {
    this.changeLoading(true);
    this.checkUser(this.props.token);
  }

  changeLoading(status) {
    this.setState({
      isLoading: status,
    });
  }

  checkUser() {
    fetch(ec2 + '/auth', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.token}`,
      },
    })
      .then((res) => {
        if (res.status === 200 || res.status === 401 || res.status === 403) {
          return res.json();
        }
        return '';
      })
      .then((payload) => {
        if (typeof payload === 'object') {
          if (payload.isAdmin !== undefined) {
            if (payload.isAdmin) {
              this.getCenterInfo(this.props.token);
            } else {
              this.getUserBasicInfo(this.props.token);
            }
          } else {
            this.props.controlLogin(-1, null);
            this.changeLoading(false);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getCenterInfo() {
    fetch(ec2 + '/user/admin', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        return '';
      })
      .then((data) => {
        if (typeof data === 'object') {
          this.props.controlCenterInfo(data);
          this.props.controlLogin(1, this.props.token);
          this.changeLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getUserBasicInfo() {
    fetch(ec2 + '/user', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        return '';
      })
      .then((data) => {
        this.props.controlBasicUserInfo(data.nickname, data.phone);
        this.props.controlLogin(0, this.props.token);
        this.changeLoading(false);
      });
  }

  render() {
    return (
      <>
        {this.state.isLoading ? (
          <View style={styles.container}>
            <ActivityIndicator size='large' color='#0000ff' />
          </View>
        ) : (
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              {this.props.authState === -1 ? (
                <>
                  <Stack.Screen
                    name='LoginContainer'
                    component={LoginContainer}
                  />
                  <Stack.Screen name='Signup' component={Signup} />
                  <Stack.Screen
                    name='UserPreference'
                    component={UserPreference}
                  />
                  <Stack.Screen
                    name='SpecialtyPreference'
                    component={SpecialtyPreference}
                  />
                </>
              ) : this.props.authState === 0 ? (
                <Stack.Screen name='Main' component={Main} />
              ) : (
                <Stack.Screen name='EntryCenter' component={EntryCenter} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
