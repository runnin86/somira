import React from 'react-native';

import Util from '../../Common/Util';
import Login from './Login';
import Setting from './Setting';
import MenuItem from '../../Common/MenuItem';
import Button from 'react-native-button';
import Store from 'react-native-simple-store';

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform
} = React;

module.exports = React.createClass({
  getInitialState() {
    this._getUser();
    return {
      // user: this.props.user
    };
  },
  componentWillReceiveProps() {
    this._getUser();
  },
  _getUser() {
    Store.get('user').then((userdata)=>{
      this.setState({
        user:userdata,
      })
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
      passProps:{
        data: data
      }
    });
  },
  render() {
    return (
      <View style={css.flex}>
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
                <Text style={css.transparentFont}>
                  {this.state.user.user_name}
                </Text>
              </View>
              <View style={css.flexRow}>
                <Button containerStyle={css.withdrawBtn}
                  onPress={(type)=>this._handlePress({type:'提现'})}>
                  <Text style={css.transparentFont}>提现</Text>
                </Button>
                <Button containerStyle={css.rechargeBtn}
                  onPress={(type)=>this._handlePress({type:'充值'})}>
                  <Text style={css.rechargeBtnFont}>充值</Text>
                </Button>
              </View>
            </View>
            :
            <View style={css.flexRow}>
              <Button containerStyle={css.withdrawBtn}
                onPress={(type)=>this._handlePress({type:'登录'})}>
                <Text style={css.transparentFont}>登录</Text>
              </Button>
            </View>
          }
        </Image>

        {
          this.state.user
          ?
          <View style={css.moneyRow}>
            <View style={css.moneyCellFixed}>
              <Image style={{width:22,height:24,alignSelf:'center'}} source={require('image!我的本金')} />
              <Text style={css.money}>
                本金 1000
              </Text>
            </View>
            <View style={css.moneyCell}>
              <Image style={{width:22.5,height:24,alignSelf:'center'}} source={require('image!我的盈利')} />
              <Text style={css.money}>
                盈利 132133.33
              </Text>
            </View>
            <View style={css.moneyCellFixed}>
              <Image style={{width:60,height:24,alignSelf:'center'}} source={require('image!本月')} />
              <Text style={css.money}>
                销量 500003292
              </Text>
            </View>
          </View>
          :
          <View></View>
        }
        {/*
          操作菜单开始
        */}
        <MenuItem
          title='我的账单'
          height='32'
          fontSize='12'
          icon='我的账单'
          onClick={function(){this._addNavigator(CouponManager,"红包")}}/>
        <View style={[css.line]} />

        <MenuItem
          title='我的订单'
          height='32'
          fontSize='12'
          icon='我的订单'
          onClick={function(){this._addNavigator(CouponManager,"红包")}}/>
        <View style={[css.line]} />

        {
          this.state.user
          ?
          <View>
            <MenuItem
              title='我的返佣'
              height='32'
              fontSize='12'
              icon='我的打赏'
              onClick={function(){this._addNavigator(CouponManager,"红包")}}/>
            <View style={[css.line]} />

            <MenuItem
              title='我的团队'
              height='32'
              fontSize='12'
              icon='我的团队'
              onClick={function(){this._addNavigator(CouponManager,"红包")}}/>
          </View>
          :
          <View></View>
        }

        <View style={{height:10}}>
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
              height='32'
              fontSize='12'
              icon='二维码'
              onClick={function(){this._addNavigator(CouponManager,"红包")}}/>
            <View style={[css.line]} />
          </View>
          :
          <View></View>
        }

        <MenuItem
          title='修改密码'
          height='32'
          fontSize='12'
          icon='修改密码'
          onClick={function(){this._addNavigator(CouponManager,"红包")}}/>
        <View style={[css.line]} />
        <MenuItem
          title='关于'
          height='32'
          fontSize='12'
          icon='帮助'
          onClick={function(){this._addNavigator(CouponManager,"红包")}}/>

        <View style={{marginTop:8,alignItems:'center',justifyContent: 'center'}}>
          <Image style={css.resizeMode} source={require('image!温馨提示')}/>
          <Text style={{marginTop:-5,height:10,fontSize: 8, color: 'red'}}>
            所有商品抽奖活动与苹果公司(Apple Inc.)无关
          </Text>
        </View>
      </View>
    )
  },
});

var css = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerImg: {
    height: Util.size['height']*0.3,
    paddingTop: Util.size['height']*0.06,
    resizeMode: Image.resizeMode.cover,
  },
  withdrawBtn: {
    marginTop: 10,
    marginRight:5,
    width:Util.size['width']*0.46,
    height:25,
    overflow:'hidden',
    borderWidth:1,
    borderColor:'#ffffff',
    borderRadius:4,
  },
  transparentFont: {
    textAlign: 'center',
    marginTop: 4,
    color:'#ffffff',
    backgroundColor:'rgba(0,152,50,0)',
  },
  rechargeBtn:{
    marginTop: 10,
    marginLeft:5,
    width:Util.size['width']*0.46,
    height:25,
    overflow:'hidden',
    borderRadius:4,
    backgroundColor: 'white',
  },
  rechargeBtnFont: {
    textAlign: 'center',
    marginTop: 4,
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
  },
  userPhoto: {
    width:50,
    height:50,
    alignSelf:'center',
    marginBottom:6,
  },
  btnPhotoMsg: {
    width:24,
    height:17,
    right: 6,
    borderRadius:4,
    top: 2
  },
  btnPhotoSet: {
    width:22,
    height:22,
    left: 6
  },
  moneyRow : {
    flexDirection : 'row',
    backgroundColor: '#3c3d42',
  },
  moneyCell: {
    flex:1,
    width:Util.size['width']*.36,
    height: 46,
    alignItems:'center',
    justifyContent : 'center'
  },
  moneyCellFixed: {
    width:Util.size['width']*.24,
    height: 46,
    justifyContent : 'center'
  },
  money: {
    textAlign: 'center',
    fontSize : 8,
    color: '#FFFFFF',
    marginTop:4,
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
  resizeMode: {
    width: 86,
    paddingBottom:10,
    backgroundColor: 'transparent',
    resizeMode:Image.resizeMode.contain,
  },
  line:{
    height:1,
    backgroundColor: '#f4f4f4',
  },
});
