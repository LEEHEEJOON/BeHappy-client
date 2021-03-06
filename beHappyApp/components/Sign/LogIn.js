import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import logo from '../../assets/behappy.png';

import CompleteModal from '../../Modal/CompleteModal';
import AlarmModal from '../../Modal/CheckModal';
import getEnvVars from '../../environment';
const { ec2 } = getEnvVars();

const { width: WIDTH } = Dimensions.get('window');

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      showPass: true,
      press: false,
      showAlarmModal: false,
      showCompleteModal: false,
      showModalText: '',
      isLoading: false,
    };

    this.loginUser = this.loginUser.bind(this);
    this.showPass = this.showPass.bind(this);
    this.handleShowAlarmModal = this.handleShowAlarmModal.bind(this);
    this.getCenterInfo = this.getCenterInfo.bind(this);
    this.changeLoading = this.changeLoading.bind(this);
    this.getUserBasicInfo = this.getUserBasicInfo.bind(this);
  }

  loginUser() {
    const { username, password } = this.state;
    fetch(ec2 + '/user/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.status === 200 || response.status === 403) {
          return response.json();
        }
        return '';
      })
      .then((payload) => {
        if (typeof payload === 'object') {
          if (!payload.errorCode && payload.adminState !== -1) {
            this.changeLoading(true);
            if (payload.adminState === 0) {
              this.getUserBasicInfo(payload.token);
            } else if (payload.adminState === 1) {
              this.getCenterInfo(payload.token);
            }
          } else if (payload.adminState === -1) {
            this.setState({
              showAlarmModal: true,
              showModalText: '아직 승인되지 않았습니다.',
            });
          } else if (payload.errorCode === 1) {
            this.setState({
              showAlarmModal: true,
              showModalText: '아이디를 확인해주세요.',
            });
          } else if (payload.errorCode === 2) {
            this.setState({
              showAlarmModal: true,
              showModalText: '비밀번호를 확인해주세요.',
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getCenterInfo(token) {
    fetch(ec2 + '/user/admin', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
          this.props.controlLogin(1, token);
          this.changeLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getUserBasicInfo(token) {
    fetch(ec2 + '/user', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
        this.props.controlLogin(0, token);
        this.changeLoading(false);
      });
  }

  showPass() {
    if (this.state.press === false) {
      this.setState({
        showPass: false,
        press: true,
      });
    } else {
      this.setState({
        showPass: true,
        press: false,
      });
    }
  }

  handleShowAlarmModal() {
    this.setState({
      showAlarmModal: false,
    });
  }

  changeLoading(status) {
    this.setState({
      isLoading: status,
    });
  }

  render() {
    const {
      username,
      password,
      showPass,
      press,
      showAlarmModal,
      showCompleteModal,
      showModalText,
    } = this.state;

    return (
      <>
        {this.state.isLoading ? (
          <View style={styles.container}>
            <ActivityIndicator size='large' color='#0000ff' />
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logo} />
            </View>
            <View style={styles.inputContainer}>
              <Icon
                style={styles.inputIcon}
                name={'ios-person'}
                size={28}
                color={'rgba(0,0,0,0.7)'}
              />
              <TextInput
                style={styles.inputBox}
                placeholder={'username'}
                placeholderTextColor={'gray'}
                underlineColorAndroid='transparent'
                value={username}
                onChangeText={(username) => this.setState({ username })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon
                style={styles.inputIcon}
                name={'ios-lock'}
                size={28}
                color={'rgba(0,0,0,0.7)'}
              />
              <TextInput
                style={styles.inputBox}
                placeholder={'password'}
                secureTextEntry={showPass}
                placeholderTextColor={'gray'}
                underlineColorAndroid='transparent'
                value={password}
                onChangeText={(password) => this.setState({ password })}
              />
              <TouchableOpacity style={styles.btnEye} onPress={this.showPass}>
                <Icon
                  name={press === true ? 'ios-eye' : 'ios-eye-off'}
                  size={26}
                  color={'rgba(0,0,0,0.7)'}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btnLogin}>
              <Text style={styles.text} onPress={this.loginUser}>
                Login
              </Text>
            </TouchableOpacity>
            <View style={styles.signEntry}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Signup')}
              >
                <Text style={styles.signUpText}>아직 회원이 아니신가요?</Text>
              </TouchableOpacity>
            </View>

            <Modal
              animationType='none'
              transparent={true}
              visible={showCompleteModal}
            >
              <CompleteModal showModalText={showModalText} />
            </Modal>

            <Modal
              animationType='none'
              transparent={true}
              visible={showAlarmModal}
            >
              <AlarmModal
                showModalText={showModalText}
                handleShowAlarmModal={this.handleShowAlarmModal}
              />
            </Modal>
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 125,
  },
  inputContainer: {
    margin: 10,
  },
  inputIcon: {
    position: 'absolute',
    top: 5,
    left: 15,
  },
  inputBox: {
    width: WIDTH - 100,
    height: 40,
    fontSize: 20,
    paddingLeft: 45,
    marginBottom: 10,
    borderBottomColor: '#199187',
    borderBottomWidth: 1,
  },
  btnEye: {
    position: 'absolute',
    top: 7,
    right: 15,
  },
  btnLogin: {
    width: WIDTH - 100,
    height: 40,
    justifyContent: 'center',
    borderRadius: 25,
    marginTop: 30,
    backgroundColor: '#62CCAD',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  signEntry: {
    justifyContent: 'center',
    paddingVertical: 16,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpBtn: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    top: '33%',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 35,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: '#62CCAD',
    borderRadius: 2,
    paddingHorizontal: 13,
    paddingVertical: 5,
    elevation: 2,
  },
  modalText: {
    fontSize: 17,
    marginBottom: 20,
    textAlign: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Login;
