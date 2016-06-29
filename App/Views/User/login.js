import React from 'react-native';
import Store from 'react-native-simple-store';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import Util from '../../Common/Util';
import * as net from '../../Network/Interface';
import ForgetPwd from '../../Component/User/ForgetPwd';

var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  TextInput,
} = React;

var login = React.createClass({
  getInitialState: function() {
    return {
      userId: "",
      pwd: "",
      logined: false,
    };
  },
  componentDidMount: function() {
    Store.get('userPhone').then((userPhone)=>{
      if (userPhone) {
        this.setState({
          userId: userPhone,
        })
      }
    });
  },
  login:function(){
    var userId = this.state.userId;
    var pwd = this.state.pwd;
    // post登录请求
    Util.post(net.userApi.login,'', {
      'userName': userId,
      'password': pwd,
    },
    ({code, msg, info})=>{
      if (code === 1) {
        Util.toast('登录成功!');
        this._loginSucc(info);
      }
      else {
        Util.toast(msg);
      }
    });
  },
  _loginSucc:function(info){
    Store.save('user', info.user);
    Store.save('userPhone', info.user.user_phone);
    Store.save('token', info.token);
    // 读取公告
    RCTDeviceEventEmitter.emit('loadNotice');
    // 设置购物车图标
		RCTDeviceEventEmitter.emit('loadCartCount');
    // 判断是否有方案的权限
    RCTDeviceEventEmitter.emit('showPlanSwitch');
    // 跳转回用户
    this.props.navigator.pop();
  },
  forgetPwd(d) {
    if (!d.phone) {
      Util.toast('请填写注册手机号!');
      return;
    }
    if (!d.vCode) {
      Util.toast('请填写验证码!');
      return;
    }
    if (!d.password) {
      Util.toast('请填写密码!');
      return;
    }
    // 发送忘记密码请求
    Util.post(net.userApi.forgetPwd, '', {
      'phone': d.phone,
      'password': d.password,
      'code': d.vCode,
      'submitType': 'forgetpwd'
    },
    ({code, msg})=>{
      if (code === 1) {
        Util.toast('找回密码成功!');
        this.props.navigator.pop();
      }
      else {
        Util.toast(msg);
      }
    });
  },
  render() {
    return (
      <View style={styles.loginform}>
        <View style={[styles.inputRow,{marginTop:90}]}>
          <Text style={styles.label} >账号</Text>
          <TextInput
            keyboardType ='numeric'
            clearButtonMode='while-editing'
            style={styles.input}
            placeholder="账号"
            value={this.state.userId}
            onChangeText={(text) => this.setState({userId: text})}/>
        </View>
        <View style={[styles.line]} />
        <View style={[styles.inputRow,{marginTop:10}]}>
          <Text style={styles.label}>密码</Text>
          <TextInput
            keyboardType ='default'
            clearButtonMode='while-editing'
            style={styles.input}
            placeholder="密码"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({pwd: text})}/>
        </View>
        <View style={[styles.line,{marginTop:2}]} />
        <TouchableHighlight style={[styles.btn,styles.marginTop30]} underlayColor='#0057a84a' onPress={this.login}>
          <Text style={{fontSize:20,fontWeight:'100'}}>登录</Text>
        </TouchableHighlight>
          <TouchableHighlight
            style={{flex:1,flexDirection:'row',alignItems: 'flex-end'}}
            underlayColor='#ffffff' onPress={()=>{
              var data = {}
              this.props.navigator.push({
                title: '找回密码',
                component: ForgetPwd,
                navigationBarHidden:false,
                rightButtonTitle: '完成',
                onRightButtonPress: () => this.forgetPwd(data),
                passProps:{
                  data: data,
                }
              });
            }}>
            <Text style={styles.style_view_register}>
              忘记密码?
            </Text>
          </TouchableHighlight>
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
    paddingLeft:30,
    paddingRight:30,
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
    fontSize:14,
    fontWeight:'100',
    color:'#63B8FF',
    marginTop:4,
    alignItems:'flex-end',
    flex:1,
    flexDirection:'row',
    textAlign:'right',
  }
});

module.exports = login;
