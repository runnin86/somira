import React from 'react-native';
import Button from 'react-native-button';
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
      userId: "",
      vCode: "",
      password: "",
    };
  },
  componentDidMount: function() {
    Store.get('userPhone').then((userPhone)=>{
      if (userPhone) {
        this.setState({
          userId: userPhone,
        });
        this.props.data.phone = userPhone;
      }
    });
  },
  getVerificationCode() {
    if (this.state.userId) {
      Util.post(net.userApi.getVCode, '', {
        'phone': this.state.userId,
        'type': 'forgetpwd'
      },
      ({code, msg})=>{
        if (code === 1) {
          Util.toast('验证码已发送至' + this.state.userId + ',请注意查收!');
        }
        else {
          Util.toast('验证码发送失败,请联系客服人员!');
        }
      });
    }
    else {
      Util.toast('请填写注册手机号!');
    }
  },
  render() {
    return (
      <View style={styles.loginform}>
        <View style={{marginTop:88,marginBottom:10,}}>
          <Text style={styles.style_view_register}>
            请设置您的新密码。密码请设置为6位以上的字母、数字、符号，尽量为三者组合，以保障您的账号安全
          </Text>
        </View>
        <View style={[styles.line,{marginLeft:-10,marginRight:-10,width:Util.size['width']}]} />
        <View style={styles.inputRow}>
          <Text style={styles.label} >注册手机号</Text>
          <TextInput
            keyboardType='phone-pad'
            clearButtonMode='while-editing'
            style={styles.input}
            placeholder="请填写手机号"
            value={this.state.userId}
            onChangeText={(text) => {
              this.setState({userId: text});
              this.props.data.phone = text;
            }}/>
          <Button containerStyle={styles.codeBtn}
            onPress={()=>this.getVerificationCode()}>
            <Text style={styles.transparentFont}>获取验证码</Text>
          </Button>
        </View>
        <View style={[styles.line]} />
        <View style={[styles.inputRow,{marginTop:10}]}>
          <Text style={styles.label}>验证码</Text>
          <TextInput
            keyboardType ='numeric'
            clearButtonMode='while-editing'
            style={styles.input}
            placeholder="请填写验证码"
            onChangeText={(text) => this.props.data.vCode = text}/>
        </View>
        <View style={[styles.line,{marginTop:2}]} />
        <View style={[styles.line,{marginTop:20,marginLeft:-10,marginRight:-10,width:Util.size['width']}]} />
        <View style={[styles.inputRow,{marginTop:10}]}>
          <Text style={styles.label}>新密码</Text>
          <TextInput
            keyboardType ='default'
            clearButtonMode='while-editing'
            style={styles.input}
            placeholder="请填写新密码"
            secureTextEntry={true}
            onChangeText={(text) => this.props.data.password = text}/>
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
    paddingLeft:10,
    paddingRight:10,
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
    fontSize:14,
    fontWeight:'100',
  },
  label: {
    width:80,
    fontSize: 14,
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
  },
  codeBtn: {
    width:80,
    height:26,
    borderWidth:1,
    borderColor:'#f4f4f4',
    borderRadius:5,
    justifyContent:'center',
  },
  transparentFont: {
    textAlign: 'center',
    color:'#000000',
    fontSize: 14,
    fontWeight: '100',
    backgroundColor:'rgba(0,152,50,0)',
  },
});

module.exports = forgetPwd;
