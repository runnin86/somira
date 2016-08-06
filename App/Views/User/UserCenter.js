import React from 'react-native';

import Button from 'react-native-button';
import Store from 'react-native-simple-store';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import Util from '../../Common/Util';
import Login from './Login';
import Setting from './Setting';
import MenuItem from '../../Common/MenuItem';
import * as net from './../../Network/Interface';
import UserBill from '../../Component/User/Bill/Bill';
import UserOrder from '../../Component/User/Order/Order';
import UserCommission from '../../Component/User/Commission';
import UserTeam from '../../Component/User/Team';
import QR from '../../Component/User/QR';
import ChangePwd from '../../Component/User/ChangePwd';
import About from '../../Component/User/About';
import Message from '../../Component/User/Message';
import MessageDetail from '../../Component/User/MessageDetail';
var PingPay = require('react-native').NativeModules.PingPay;

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Platform,
  AlertIOS,
} = React;

module.exports = React.createClass({
  getInitialState() {
    this._getUser();
    return {
      // user: this.props.user,
      salesImg: '本月',
      isRefreshing: false,
    };
  },
  componentWillReceiveProps() {
    this._getUser();
  },
  componentDidMount(){
    RCTDeviceEventEmitter.addListener('showPushMessage', (mid)=>{
      // 展示消息详情
      this.props.navigator.push({
        title: "消息详情",
        component: MessageDetail,
        navigationBarHidden:false,
        passProps:{
          id: mid,
        }
      });
    });
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
  _addNavigator: function(component, title){
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
      var data = {};
      this.props.navigator.push({
        title: title,
        component: component,
        navigationBarHidden:false,
        rightButtonTitle: title==='修改密码'?'完成':'',
        onRightButtonPress: () => this.changePwd(data),
        passProps:{
          data: data,
        }
      });
    }
  },
  changePwd(d) {
    if (!d.oldPwd) {
      Util.toast('旧密码不能为空!');
      return;
    }
    if (!d.newPwd) {
      Util.toast('新密码不能为空!');
      return;
    }
    if (d.oldPwd && d.newPwd) {
      // 去修改密码
      Store.get('token').then((token)=>{
        if (token) {
          Util.post(net.userApi.changePwd, token, {
            'npwd': d.newPwd,
            'opwd': d.oldPwd
          },
          ({code, msg, result})=>{
            if (code === 1) {
              Util.toast('密码修改成功!');
              d = {};
              Store.delete('user');
              Store.delete('token');
              // 跳转回用户
              this.props.navigator.pop();
              // 退出后隐藏方案
              RCTDeviceEventEmitter.emit('showPlanSwitch');
            }
            else {
              Util.toast(msg);
            }
          });
        }
      });
    }
  },
  _onRefresh() {
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState({
        isRefreshing: false,
      });
    }, 5000);
  },
  doWithDraw(wm) {
    let m = parseInt(wm);
    if (!Number.isInteger(m)) {
      Util.toast('请输入正确的提现金额');
      return false;
    }
    if ((Math.round(m * 100) / 100) < 10) {
      Util.toast('提现金额不能少于10元');
    }
    else if (m > this.state.userate){
      Util.toast('提现金额不能大于'+this.state.userate+'元');
    }
    else {
      Store.get('token').then((token)=>{
        if (token) {
          Util.post(net.userApi.withdraw, token, {
            'wtype': '1',
            'wmoney': m,
          },
          ({code, msg, result})=>{
            if (code === 1) {
              Util.toast('恭喜您，提现成功!\n工作人员会在3个工作日内与您联系');
              this._getUserate(token);
            }
            else {
              Util.toast('提现失败:' + msg);
            }
          });
        }
        else {
          Util.toast('会话失效,请重新登录');
        }
      });
    }
  },
  rechargeFn() {
    // if (this.state.user.user_type === 1) {
    //   AlertIOS.alert(
    //     '充值提示',
    //     "(您要对账号"+this.state.user.user_phone+"进行充值)\n￥1000.00",
    //     [
    //       {text: '取消', onPress: null},
    //       {text: '立即充值', onPress: ()=>{
    //         PingPay.addEvent('wx', net.chargeUrl, this.state.user.user_phone, 1000, '2');
    //       }},
    //     ]
    //   );
    // }
    // else {
      Util.toast('充值功能暂未开放,敬请期待!');
    // }
  },
  render() {
    return (
      <ScrollView style={css.flex}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
            tintColor="#c40001"
            title="玩命加载中..."
          />
        }>
        <Image style={[css.headerImg]} source={{uri: '个人中心背景'}}>
          <View style={css.cellfixed,css.rightBtn}>
            {
              this.state.user && this.state.user.user_type === 1
              ?
              <Button onPress={()=>{this._addNavigator(Message,"消息列表")}}>
                <Image style={css.btnPhotoMsg}
                  source={require('image!消息按钮')}/>
              </Button>
              :
              null
            }
            <Button onPress={()=>{this._addNavigator(Setting,"设置")}}>
              <Image style={css.btnPhotoSet}
                source={require('image!设置按钮')}/>
            </Button>
          </View>
          <View style={css.cellfixed}>
            <View style={
              this.state.user && this.state.user.user_type === 0
              ?
              css.baseUserRow
              :
              null
            }>
              <Image style={css.userPhoto} source={require('image!默认头像')}/>
              {
                this.state.user && this.state.user.user_type === 0
                ?
                <View style={{marginLeft:14,height:56}}>
                  <Text style={[css.transparentFont,{fontSize:18,lineHeight:28,}]}>
                    {
                      this.state.user.user_nickname
                      ?
                      this.state.user.user_nickname
                      :
                      this.state.user.user_name
                    }
                  </Text>
                  <Text style={[css.transparentFont,{fontSize:14,marginTop:4}]}>
                    余额 {this.state.userate ? this.state.userate : 0}
                  </Text>
                </View>
                :
                null
              }
            </View>
          </View>
          {
            this.state.user
            ?
            <View>
              {
                this.state.user.user_type === 1
                ?
                <View style={css.cellfixed}>
                  <Text style={[css.transparentFont,{fontSize:18}]}>
                    {
                      this.state.user.user_nickname
                      ?
                      this.state.user.user_nickname
                      :
                      this.state.user.user_name
                    }
                  </Text>
                </View>
                :
                null
              }
              <View style={css.flexRow}>
                {
                  this.state.user.user_type === 1
                  ?
                  <Button containerStyle={css.withdrawBtn}
                    onPress={()=>{
                      {
                        this.state.userate < 10
                        ?
                        Util.toast('盈利暂时不满足提现条件哦!')
                        :
                        AlertIOS.alert(
                          '请输入提现金额',
                          '您可以提现的金额为:' + this.state.userate + '元',
                          [{
                             text: '确认',
                             onPress: (text)=>{this.doWithDraw(text)},
                             style: 'destructive',
                          }, {
                             text: '取消',
                             style: 'cancel',
                          }],
                          'plain-text'//secure-text
                        )
                      }
                    }}>
                    <Text style={[css.transparentFont,{fontSize:16}]}>提现</Text>
                  </Button>
                  :
                  null
                }
                <Button containerStyle={[css.rechargeBtn,{
                  width:
                  this.state.user.user_type === 1
                  ?
                  Util.size['width'] * 0.46
                  :
                  Util.size['width'] * 0.68
                }]}
                  onPress={()=>{this.rechargeFn()}}>
                  <Text style={[css.rechargeBtnFont,{fontSize:16}]}>充值</Text>
                </Button>
              </View>
            </View>
            :
            <View style={css.flexRow}>
              <Button containerStyle={css.withdrawBtn}
                onPress={()=>{this._addNavigator(Login,"登录")}}>
                <Text style={[css.transparentFont,{fontSize:18}]}>登录</Text>
              </Button>
            </View>
          }
        </Image>

        {
          this.state.user && this.state.user.user_type === 1
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
        {
          this.state.user && this.state.user.user_type === 1
          ?
          <View>
            <MenuItem
              title='我的账单'
              height='40'
              fontSize='14'
              icon='我的账单'
              onClick={()=>{this._addNavigator(UserBill,"我的账单")}}/>
            <View style={[css.line]} />
          </View>
          :
          <View></View>
        }

        <MenuItem
          title='我的订单'
          height='40'
          fontSize='14'
          icon='我的订单'
          onClick={()=>{this._addNavigator(UserOrder,"我的订单")}}/>
        <View style={[css.line]} />

        {
          this.state.user && this.state.user.user_type === 1
          ?
          <View>
            <MenuItem
              title='我的返佣'
              height='40'
              fontSize='14'
              icon='我的返佣'
              onClick={()=>{this._addNavigator(UserCommission,"我的返佣")}}/>
            <View style={[css.line]} />

            <MenuItem
              title='我的团队'
              height='40'
              fontSize='14'
              icon='我的团队'
              onClick={()=>{this._addNavigator(UserTeam,"我的团队")}}/>
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
          this.state.user && this.state.user.user_type === 1
          ?
          <View>
            <MenuItem
              title='我的二维码'
              height='40'
              fontSize='14'
              icon='二维码'
              onClick={()=>{this._addNavigator(QR,"我的二维码")}}/>
            <View style={[css.line]} />
          </View>
          :
          <View></View>
        }

        <MenuItem
          title='修改密码'
          height='40'
          fontSize='14'
          icon='修改密码'
          onClick={()=>{this._addNavigator(ChangePwd,"修改密码")}}/>
        <View style={[css.line]} />

        <MenuItem
          title='关于'
          height='40'
          fontSize='14'
          icon='关于'
          onClick={()=>{this._addNavigator(About,"关于")}}/>

        <View style={{marginTop:8,alignItems:'center',justifyContent: 'center'}}>
          <Image style={css.warnning} source={require('image!温馨提示')}/>
          <Text style={{height:20,fontSize: 13,fontWeight:'100', color: 'red'}}>
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
    height: 180,
    paddingTop: 16,
    resizeMode: Image.resizeMode.cover,
  },
  withdrawBtn: {
    marginTop: 7,
    marginRight:5,
    width:Util.size['width']*0.46,
    height:36,
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
    height:36,
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
    top: 9,
  },
  btnPhotoSet: {
    width:26,
    height:26,
    left: 6,
    top: 6,
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
    fontSize: 13,
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
    borderTopColor : '#C0C0C0',
    borderTopWidth : 1,
    backgroundColor: '#ffffff',
  },
  borderBottom: {
    borderBottomColor : '#C0C0C0',
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
  baseUserRow:{
    flexDirection:'row',
    marginLeft:Util.size['width'] * 0.2,
  }
});
