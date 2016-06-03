import React from 'react-native';
import Util from '../../Common/Util';
import Store from 'react-native-simple-store';

var {
	StyleSheet,
	View,
	Text,
  LinkingIOS,
  TouchableHighlight,
  SwitchIOS,
} = React;

var Setting = React.createClass({
  getInitialState: function() {
    return {
      user:null,
      falseSwitchIsOn: false,
    };
  },
  _call:function(){
    LinkingIOS.openURL('tel://4007008780');
  },
	logout:function(){
		Store.delete('user');
		Store.delete('token');
    this.props.navigator.pop();
  },
  render: function() {
    return (
      <View style={{backgroundColor:'#eef0f3',marginTop:68,height:Util.size['height'],}}>
        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff',height:40,paddingLeft:20,paddingRight:16}}>
          <Text style={{flex:1,color:'#333333',fontSize:12}}>
            铃声提醒
          </Text>
          <SwitchIOS
            onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
            style={{marginBottom: 4}}
            value={this.state.falseSwitchIsOn} />
        </View>

				<View style={[styles.line]} />

        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff',height:40,paddingLeft:20,paddingRight:16}}>
          <Text style={{flex:1,color:'#333333',fontSize:12}}>
            WIFI环境下自动更新
          </Text>
          <SwitchIOS
            onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
            style={{marginTop: 4,marginBottom: 4}}
            value={true} />
        </View>

				<View style={[styles.line]} />

        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff',height:40,paddingLeft:20,paddingRight:16}}>
          <Text style={{flex:1,color:'#333333',fontSize:12}}>
            版本更新1.10
          </Text>
          <Text style={{flex:1,color:'gray',fontSize:10,textAlign:'right',}}>
            已是最新版本
          </Text>
        </View>

        <TouchableHighlight style={[styles.btn]} underlayColor='#0057a84a' onPress={this.logout}>
          <Text style={{color:'#fff'}}>退出登录</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={{justifyContent:'center',alignItems:'center',backgroundColor:'#ffffff',height:45,marginTop:30}}
          underlayColor="#dad9d7" onPress={()=>this._call()}>
         <Text>拨打客服400-700-8780</Text>
        </TouchableHighlight>

      </View>
    );
  },
});

var styles = StyleSheet.create({
  btn:{
    height:35,
    margin:10,
    backgroundColor:'#FF4500',
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 10,
    borderWidth:1,
    borderColor:'#ffffff',
  },
	line:{
    height:1,
    backgroundColor: '#f4f4f4',
  },
});

module.exports = Setting;
