import React from 'react-native';

import Util from '../../Common/Util';
import Login from './Login';
import Setting from './Setting';
import MenuItem from '../../Common/MenuItem';
import Button from 'react-native-button';
import Store from 'react-native-simple-store';
import * as net from './../../Network/Interface';
import UserBill from '../../Component/User/UserBill';
import UserOrder from '../../Component/User/UserOrder';

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform
} = React;

module.exports = React.createClass({
  getInitialState() {
    this._getUser();
    return {
      // user: this.props.user,
      salesImg: '本月',
    };
  },
  componentWillReceiveProps() {
    this._getUser();
  },
  _getUser() {
    // 用户基本信息
    Store.get('user').then((userdata)=>{
      this.setState({
        user:userdata,
      })
    });
    // 用户账户信息
    Store.get('token').then((token)=>{
      if (token) {
        // 获取用户本金
        this._getCoinmeter(token);
        // 获取用户利润
        this._getUserate(token);
        // 获取用户本月销量
        this._getUsersales(token);
      }
    });
  },
  _getCoinmeter(token) {
    Util.post(net.userApi.coinmeter, token, {},
    ({code, msg, result})=>{
      if (code === 1) {
        this.setState({
          coinmeter: result.coinmeter
        });
      }
    });
  },
  _getUserate(token) {
    Util.post(net.userApi.useRate, token, {},
    ({code, msg, result})=>{
      if (code === 1) {
        this.setState({
          userate: result.rateAccount
        });
      }
    });
  },
  _getUsersales(token) {
    Util.post(net.userApi.userSales, token, {},
    ({code, msg, result})=>{
      if (code === 1) {
        this.setState({
          usersales: result.userFlow
        });
      }
    });
  },
  _getLastsales(token) {
    Util.post(net.userApi.lastSales, token, {},
    ({code, msg, result})=>{
      if (code === 1) {
        this.setState({
          usersales: result.userFlow
        });
      }
    });
  },
  _switchSales() {
    Store.get('token').then((token)=>{
      if (token) {
        if (this.state.salesImg === '本月') {
          this.setState({
            salesImg: '上月'
          });
          this._getLastsales(token);
        }
        else {
          this.setState({
            salesImg: '本月'
          });
          this._getUsersales(token);
        }
      }
    });
  },
  _handlePress(event) {
    if (!this.state.user) {
      this.props.navigator.push({
        component:Login,
        navigationBarHidden:false,
        // tintColor:'#FFFFFF',
        // barTintColor: '#FFFFFF',
        title:'登录'
      });
    }
    else {
      // alert(event.type);
      if (event.type === 'Setting') {
        this.props.navigator.push({
          component:Setting,
          leftButtonTitle: '',
          // leftButtonIcon: {uri: '返回箭头'},
          navigationBarHidden:false,
          // tintColor:'#FFFFFF',
          // barTintColor: '#FFFFFF',
          title:'设置'
        });
      }
    }
  },
  _addNavigator: function(component, title){
    var data = null;
    this.props.navigator.push({
      title: title,
      component: component,
      navigationBarHidden:false,
      passProps:{
        data: data
      }
    });
  },
  render() {
    return (
      <ScrollView style={css.flex}>
        <Image style={[css.headerImg]} source={{uri: '个人中心背景'}}>
          <View style={css.cellfixed,css.rightBtn}>
            <Button onPress={(type)=>this._handlePress({type:'消息'})}>
              <Image style={css.btnPhotoMsg}
                source={require('image!消息按钮')}/>
            </Button>
            <Button onPress={(type)=>this._handlePress({type:'Setting'})}>
              <Image style={css.btnPhotoSet}
                source={require('image!设置按钮')}/>
            </Button>
          </View>
          <View style={css.cellfixed}>
            <Image style={css.userPhoto}
              source={require('image!默认头像')}/>
          </View>
          {
            this.state.user
            ?
            <View>
              <View style={css.cellfixed}>
                <Text style={[css.transparentFont,{fontSize:18}]}>
                  {this.state.user.user_name}
                </Text>
              </View>
              <View style={css.flexRow}>
                <Button containerStyle={css.withdrawBtn}
                  onPress={(type)=>this._handlePress({type:'提现'})}>
                  <Text style={[css.transparentFont,{fontSize:16}]}>提现</Text>
                </Button>
                <Button containerStyle={css.rechargeBtn}
                  onPress={(type)=>this._handlePress({type:'充值'})}>
                  <Text style={[css.rechargeBtnFont,{fontSize:16}]}>充值</Text>
                </Button>
              </View>
            </View>
            :
            <View style={css.flexRow}>
              <Button containerStyle={css.withdrawBtn}
                onPress={(type)=>this._handlePress({type:'登录'})}>
                <Text style={[css.transparentFont,{fontSize:18}]}>登录</Text>
              </Button>
            </View>
          }
        </Image>

        {
          this.state.user
          ?
          <View style={css.moneyRow}>
            <View style={{justifyContent:'center',marginLeft:10}}>
              <Image style={{width:22,height:24,alignSelf:'center'}} source={require('image!我的本金')} />
              <Text style={css.money}>
                本金 {this.state.coinmeter ? this.state.coinmeter : 0}
              </Text>
            </View>
            <View style={[css.moneyCell,{marginLeft:10}]}>
              <Image style={{width:22.5,height:24,alignSelf:'center'}} source={require('image!我的盈利')} />
              <Text style={css.money}>
                盈利 {this.state.userate ? this.state.userate : 0}
              </Text>
            </View>
            <TouchableOpacity onPress={this._switchSales}>
              <View style={{justifyContent:'center',marginRight:10}}>
                <Image style={{width:60,height:24,alignSelf:'center'}} source={{uri: this.state.salesImg}} />
                <Text style={css.money}>
                  销量 {this.state.usersales ? this.state.usersales : 0}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          :
          <View></View>
        }
        {/*
          操作菜单开始
        */}
        <MenuItem
          title='我的账单'
          height='30'
          fontSize='12'
          icon='我的账单'
          onClick={()=>{this._addNavigator(UserBill,"我的账单")}}/>
        <View style={[css.line]} />

        <MenuItem
          title='我的订单'
          height='30'
          fontSize='12'
          icon='我的订单'
          onClick={()=>{this._addNavigator(UserOrder,"我的订单")}}/>
        <View style={[css.line]} />

        {
          this.state.user
          ?
          <View>
            <MenuItem
              title='我的返佣'
              height='30'
              fontSize='12'
              icon='我的打赏'
              onClick={()=>{this._addNavigator(CouponManager,"我的返佣")}}/>
            <View style={[css.line]} />

            <MenuItem
              title='我的团队'
              height='30'
              fontSize='12'
              icon='我的团队'
              onClick={()=>{this._addNavigator(CouponManager,"我的团队")}}/>
          </View>
          :
          <View></View>
        }

        <View style={{height:6}}>
          {/*
            分解符
          */}
        </View>

        {
          this.state.user
          ?
          <View>
            <MenuItem
              title='我的二维码'
              height='30'
              fontSize='12'
              icon='二维码'
              onClick={()=>{this._addNavigator(CouponManager,"我的二维码")}}/>
            <View style={[css.line]} />
          </View>
          :
          <View></View>
        }

        <MenuItem
          title='修改密码'
          height='30'
          fontSize='12'
          icon='修改密码'
          onClick={()=>{this._addNavigator(CouponManager,"修改密码")}}/>
        <View style={[css.line]} />
        <MenuItem
          title='关于'
          height='30'
          fontSize='12'
          icon='关于'
          onClick={()=>{this._addNavigator(CouponManager,"关于")}}/>

        <View style={{marginTop:8,alignItems:'center',justifyContent: 'center'}}>
          <Image style={css.warnning} source={require('image!温馨提示')}/>
          <Text style={{height:20,fontSize: 10,fontWeight:'100', color: 'red'}}>
            所有商品抽奖活动与苹果公司(Apple Inc.)无关
          </Text>
        </View>
      </ScrollView>
    )
  },
});

var css = StyleSheet.create({
  flex: {
    flex: 1,
    marginTop: -20,
  },
  headerImg: {
    height: 174,
    paddingTop: 16,
    resizeMode: Image.resizeMode.cover,
  },
  withdrawBtn: {
    marginTop: 7,
    marginRight:5,
    width:Util.size['width']*0.46,
    height:30,
    borderWidth:1,
    borderColor:'#ffffff',
    borderRadius:4,
    justifyContent:'center',
  },
  transparentFont: {
    textAlign: 'center',
    color:'#ffffff',
    backgroundColor:'rgba(0,152,50,0)',
  },
  rechargeBtn:{
    marginTop: 7,
    marginLeft:5,
    width:Util.size['width']*0.46,
    height:30,
    borderRadius:4,
    backgroundColor: 'white',
    justifyContent:'center',
  },
  rechargeBtnFont: {
    textAlign: 'center',
    color:'red'
  },
  cellfixed: {
    width: Util.size['width'],
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignSelf:'center',
  },
  rightBtn: {
    flexDirection: 'row',
    alignSelf:'flex-end',
    marginRight:20,
    marginBottom:4,
    marginTop:6,
  },
  userPhoto: {
    width:56,
    height:56,
    alignSelf:'center',
    marginBottom:4,
  },
  btnPhotoMsg: {
    width:30,
    height:21,
    right: 6,
    borderRadius:4,
    top: 2
  },
  btnPhotoSet: {
    width:26,
    height:26,
    left: 6
  },
  moneyRow : {
    flexDirection : 'row',
    height: 44,
    backgroundColor: '#3c3d42',
  },
  moneyCell: {
    flex:1,
    width:Util.size['width']*.36,
    alignItems:'center',
    justifyContent : 'center'
  },
  money: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '100',
    color: '#FFFFFF',
    marginTop:2,
  },
  container: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
  },
  borderTop: {
    borderTopColor : '#eeeeee',
    borderTopWidth : 1,
    backgroundColor: '#ffffff',
  },
  borderBottom: {
    borderBottomColor : '#eeeeee',
    borderBottomWidth : 1,
    backgroundColor: '#ffffff',
  },
  l_8: {
    // width:Util.size['width']*0.33,
    marginLeft:-8,
  },
  rightArrow: {
    width:10,
    height:16.5
  },
  menuText: {
    width:Util.size['width']*0.83,
    marginLeft:8,
    fontSize:10,
  },
  userMenu: {
    width:Util.size['width'],
    height: 28,
    alignItems:'center',
    justifyContent:'center',
  },
  warnning: {
    width: 100,
    paddingBottom:20,
    backgroundColor: 'transparent',
    resizeMode:Image.resizeMode.contain,
  },
  line:{
    height:1,
    backgroundColor: '#f4f4f4',
  },
});
