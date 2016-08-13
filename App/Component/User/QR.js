import React from 'react-native';
import Store from 'react-native-simple-store';

import QRCode from '../../Common/QRCode';
import Util from '../../Common/Util';
import * as net from '../../Network/Interface';

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
} = React;

module.exports = React.createClass({
  /*
   * 获取实例初始状态(state，来自props)
   */
  getInitialState: function () {
    Store.get('user').then((userdata)=>{
      this.setState({
        uname:userdata.user_name,
      })
    });
    return {
      text: ''
    }
  },
  componentDidMount: function() {
    Store.get('token').then((token)=>{
      if (token) {
        Util.post(net.userApi.qrcode, token, {},
        ({code, msg, result})=>{
          if (code === 1) {
            this.setState({
              text: result
            });
          }
          else {
            Util.toast(msg);
          }
        });
      }
    });
  },
  /*
   * 渲染(JSX,通过state控制DOM结构变化)
   */
  render: function() {
    return (
      <View style={css.container}>
        <Image style={[css.backgroundImg,css.center]} source={{uri: 'qrbackground'}}>
          <View style={[css.center,{
            marginTop: -(Util.size['height']*0.292),
            height: Util.size['width']*0.44,
          }]}>
            {
              this.state.text !== ''
              ?
              <QRCode
                value={this.state.text}
                size={Util.size['width']*0.44}
                bgColor='#FFFFFF'
                fgColor='#000000'/>
              :
              null
            }
          </View>
          <View style={css.textArea}>
            <Text style={css.textDesc}>
              您现在要扫描用户[
                <Text style={{color:'#8A2BE2'}}>
                  {this.state.uname}
                </Text>
              ]的二维码
            </Text>
          </View>
        </Image>
      </View>
    );
  }
});

var css = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f4f4f4',
    marginTop: 26,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImg: {
    height: Util.size['height'],
    width: Util.size['width'],
    resizeMode: Image.resizeMode.stretch,
  },
  textArea: {
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#ffffff',
    height:30,
    width:Util.size['width'],
    top:Util.size['height']*0.04,
  },
  textDesc: {
    flex:1,
    color:'#333333',
    fontSize:13,
    fontWeight:'100',
    textAlign: 'center'
  }
});
