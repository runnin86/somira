import React from 'react-native';
import Util from '../../Common/Util';
import * as net from '../../Network/Interface';
import Store from 'react-native-simple-store';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  TextInput,
} = React;

var forgetPwd = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render() {
    return (
      <View style={styles.loginform}>
        <View style={{marginTop:88,marginBottom:10,}}>
          <Text style={styles.style_view_register}>
            请设置您的新密码。密码请设置为6位以上的字母、数字、符号，尽量为三者组合，以保障您的账号安全
          </Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label} >旧密码</Text>
          <TextInput
            keyboardType ='default'
            clearButtonMode='while-editing'
            style={styles.input}
            placeholder="请填写旧密码"
            secureTextEntry={true}
            onChangeText={(text) => this.props.data.oldPwd = text}/>
        </View>
        <View style={[styles.line]} />
        <View style={[styles.inputRow,{marginTop:10}]}>
          <Text style={styles.label}>新密码</Text>
          <TextInput
            keyboardType ='default'
            clearButtonMode='while-editing'
            style={styles.input}
            placeholder="请填写新密码"
            secureTextEntry={true}
            onChangeText={(text) => this.props.data.newPwd = text}/>
        </View>
        <View style={[styles.line,{marginTop:2}]} />
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex:1,
  },
  loginform:{
    marginTop:-10,
    backgroundColor:'#ffffff',
    paddingLeft:20,
    paddingRight:20,
  },
  line:{
    height:1,
    backgroundColor: '#f4f4f4',
  },
  marginTop30:{
    marginTop:30,
  },
  inputRow:{
    backgroundColor:'00000000',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  input:{
    height:35,
    borderColor:'#ccc',
    flex:1,
    fontSize:16,
    fontWeight:'100',
  },
  label: {
    width:60,
    fontSize: 16,
    fontWeight:'100',
  },
  btn:{
    height:Util.size['height']*0.068,
    backgroundColor:'#45c9a2',
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 10,
    borderWidth:1,
    borderColor:'#ffffff',
  },
  style_view_register:{
    fontSize:12,
    fontWeight:'100',
    color:'#c40001',
    textAlign:'left',
  }
});

module.exports = forgetPwd;
