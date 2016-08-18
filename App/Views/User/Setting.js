import React from 'react-native';
import Util from '../../Common/Util';
import Store from 'react-native-simple-store';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
var AppDelegate = require('react-native').NativeModules.AppDelegate;

var {
	StyleSheet,
	View,
	Text,
  TouchableHighlight,
  SwitchIOS,
	TouchableOpacity,
	Platform,
	Alert,
	ActivityIndicatorIOS,
} = React;

import {
	isFirstTime,
  isRolledBack,
  packageVersion,
  currentVersion,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  switchVersionLater,
  markSuccess,
} from 'react-native-update';

import _updateConfig from './../../../update.json';
const {appKey} = _updateConfig[Platform.OS];

var VersionLabel = React.createClass({
	getInitialState: function() {
		return {
			canCheck: false,
		};
	},
	componentDidMount() {
		// 根据用户类型判断是否展示方案
		Store.get('user').then((user)=>{
			if (user && user.user_type === 1) {
				this.setState({canCheck: true});
			}
		});
	},
  render: function() {
		const labelCss = {flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff',height:40,paddingLeft:20,paddingRight:16};
		const text1 = {flex:1,color:'#333333',fontSize:14,fontWeight:'100'};
		const text2 = {flex:1,color:'red',fontSize:12,fontWeight:'100',textAlign:'right',};
    return (
			<View>
			  {
					this.state.canCheck
					?
					<TouchableOpacity
						style={labelCss}
						onPress={this.checkUpdate}>
						<Text style={text1}>
							当前版本
						</Text>
						<Text style={text2}>
							{packageVersion}
						</Text>
					</TouchableOpacity>
					:
					<View
						style={labelCss}>
						<Text style={text1}>
							当前版本
						</Text>
						<Text style={text2}>
							{packageVersion}
						</Text>
					</View>
				}
			</View>
    );
  },
	checkUpdate() {
		// 方案可看用户才可去检查更新
		this.props.callback(true);
		checkUpdate(appKey).then(info => {
			if (info.expired) {
				Alert.alert('提示', '您的应用版本已过期,请前往应用商店下载新的版本', [
					{text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
				]);
			} else if (info.upToDate) {
				Alert.alert('提示', '您的应用版本已是最新.');
			} else {
				// info.name
				Alert.alert('提示', '检测到系统优化,是否下载?\n'+ info.description, [
					{text: '是', onPress: ()=>{this.doUpdate(info)}},
					{text: '否',},
				]);
			}
			this.props.callback(false);
		}).catch(err => {
			Alert.alert('提示', '更新失败.');
		});
	},
	doUpdate(info) {
		downloadUpdate(info).then(hash => {
			Alert.alert('提示', '下载完毕,是否重启应用?', [
				{text: '是', onPress: ()=>{switchVersion(hash);}},
				{text: '否',},
				{text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
			]);
		}).catch(err => {
			Alert.alert('提示', '更新失败.');
		});
	}
});

var Setting = React.createClass({
  getInitialState: function() {
    return {
      // user:null,
      falseSwitchIsOn: false,
			load: false,
    };
  },
	logout:function(){
		Store.delete('user');
		Store.delete('token');
		Store.delete('globalNoticeId');
		// 设置购物车图标
		RCTDeviceEventEmitter.emit('loadCartCount');
		// 退出后隐藏方案
		RCTDeviceEventEmitter.emit('showPlanSwitch');
		// 与ios进行通信,去注册腾讯信鸽
		AppDelegate.unRegisterXG();
		// 跳转回用户
    this.props.navigator.pop(['rippleEffect', 'fromBottom']);
  },
	_callback(load) {
		this.setState({
      load: load,
    });
	},
  render: function() {
    return (
      <View style={{backgroundColor:'#eef0f3',marginTop:68,height:Util.size['height'],}}>
			  {
					this.state.falseSwitchIsOn
					?
					<View>
						<View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff',height:40,paddingLeft:20,paddingRight:16}}>
							<Text style={{flex:1,color:'#333333',fontSize:14,fontWeight:'100'}}>
								铃声提醒
							</Text>
							<SwitchIOS
								onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
								style={{marginBottom: 4}}
								value={this.state.falseSwitchIsOn} />
						</View>

						<View style={[styles.line]} />

						<View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff',height:40,paddingLeft:20,paddingRight:16}}>
							<Text style={{flex:1,color:'#333333',fontSize:14,fontWeight:'100'}}>
								WIFI环境下自动更新
							</Text>
							<SwitchIOS
								onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
								style={{marginTop: 4,marginBottom: 4}}
								value={true} />
						</View>

						<View style={[styles.line]} />
					</View>
					:
					null
				}

        <VersionLabel callback={this._callback}/>

        <TouchableHighlight style={[styles.btn]} underlayColor='#0057a84a' onPress={this.logout}>
          <Text style={{color:'#ffffff',fontSize:18}}>退出登录</Text>
        </TouchableHighlight>
				<ActivityIndicatorIOS
					animating={this.state.load}
					style={styles.acl} color="#aa00aa" />
      </View>
    );
  },
});

var styles = StyleSheet.create({
  btn:{
		height:Util.size['height']*0.068,
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
	acl: {
    alignItems: 'center',
    justifyContent: 'center',
		marginTop:Util.size['height']/2-180
  },
});

module.exports = Setting;
