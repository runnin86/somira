//商品列表
'use strict';

import React from 'react-native';
import * as Animatable from 'react-native-animatable';
import Store from 'react-native-simple-store';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Button from 'react-native-button';

import Util from './../../Common/Util';
import PlanDetail from './PlanDetail';
import * as net from './../../Network/Interface';

var {
  StyleSheet,
  ListView,
  Text,
  Image,
  View,
  TouchableOpacity,
} = React;

module.exports = React.createClass({
  getInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(this.props.plans),
      serviceTime: this.props.serviceTime,
      // loaded: false
    };
  },
  componentWillReceiveProps () {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.plans),
      serviceTime: this.props.serviceTime,
    });
    // console.log(this.props.plans);
  },
  //渲染列表
  renderListView : function(){
    //先展示加载中的菊花
    // if(!this.state.loaded){
    //   return(
    //     <Image style={css.loading} source={require('image!loading')} />
    //   );
    // };
    return(
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        style={css.listView}/>
    );
  },
  _animatables: {},
  _pushCart: function(event, id, remainingTime){
    if (remainingTime > 0) {
      // 乐夺宝添加至购物车,需要token数据
      Store.get('token').then((token)=>{
        if (token) {
          Util.post(net.planApi.addCart, token, {
            'pid': id
          },
          ({code, msg})=>{
            if (code === 1) {
              Util.toast('已加入购物车');
              // 动画效果
              this._animatables[id]['slideInLeft'](1000);
              // 设置购物车图标
              RCTDeviceEventEmitter.emit('loadCartCount');
            }
            else {
              Util.toast(msg);
            }
          });
        }
        else {
          Util.toast('您尚未登录!');
          // 跳转登录
          // this.$route.router.go({path: '/login?from=plan', replace: true})
        }
      });
    }
    else {
      Util.toast('方案已截止,不可购买');
    }
  },
  //选中一行
  selectPlan:function(plan) {
    this.props.navigator.push({
      title: '方案详情',
      component: PlanDetail,
      // leftButtonTitle: '返回',
      navigationBarHidden: false,
      // onLeftButtonPress: () => this.props.navigator.pop(),
      rightButtonColor: '#f4c600',
      rightButtonIcon: {uri: '赏'},
      onRightButtonPress: () => {
        // 打赏
        RCTDeviceEventEmitter.emit('rewardPlan', plan.plan_id);
      },
      passProps: {
        planId: plan.plan_id
      }
    });
  },
  //渲染每一行
  renderRow(plan) {
    let filterTime = Util.getDateDiff(this.state.serviceTime, plan.deadline_time, 'minute');
    let redHeart = plan.planConfident;
    return (
      <TouchableOpacity onPress={this.selectPlan.bind(this, plan)}>
        <View style={css.planView}>
          <Animatable.Image ref={component => this._animatables[plan.plan_id] = component} style={css.expertPhoto} source={{uri : plan.expert_photo}} />
          <View style={css.planInfo}>
            <Text style={{fontSize : 15,fontWeight:'100',marginBottom:4,}}>
              {plan.expert_name}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Image style={{width:15,height:12}}
                source={{uri: '720信心'}} />
              <Image style={{width:15,height:12}}
                source={{uri: '720信心'}} />
              <Image style={{width:15,height:12}}
                source={{uri: '720信心'}} />
              <Image style={{width:15,height:12}}
                source={{uri: redHeart>=4?'720信心':''}} />
              <Image style={{width:15,height:12}}
                source={{uri: redHeart>=5?'720信心':''}} />
            </View>
          </View>
          <View style={[css.row,{marginRight:-8,}]}>
            <Text style={[css.redPrice,{fontWeight : '100',fontSize : 20,marginLeft : 4}]}>
              &yen; {plan.plan_amount}
            </Text>
          </View>
          <View style={[css.row,{marginRight:20,}]}>
            <Image style={{width:24,height:26}}
              source={require('image!时间')} />
            <Text style={{fontWeight : '100',fontSize : 12,marginLeft : 4}}>
              {filterTime > 0 ? filterTime + '分钟' : '已截止'}
            </Text>
          </View>
          <View style={[css.row],{alignItems:'flex-end',marginRight:10,}}>
            <Button onPress={()=>this._pushCart(this, plan.plan_id, filterTime)}>
              <Image style={{width:32,height:32}}
                source={{uri: filterTime > 0 ? '购物车-选中' : '购物车'}} />
            </Button>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
	render() {
		return (
      this.renderListView()
    );
	}
});

// 组件样式
var css = StyleSheet.create({
  loading :{
    marginTop : 10,
    justifyContent: 'center',
    alignItems: 'center',
    height : 21,
    resizeMode: Image.resizeMode.contain,
    width: Util.size['width']
  },
  listView : {
    backgroundColor : '#ffffff',
    // backgroundColor: 'lightgreen',
  },
  planView: {
    flex : 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: '#eeeeee',
    borderTopWidth: 1,
  },
  expertPhoto : {
    width : 42,
    height : 50,
    margin: 10,
  },
  planInfo : {
    flex : 1,
    flexDirection : 'column'
  },
  row : {
    flex: 1,
    flexDirection : 'row',
    alignItems: 'center',
  },
  redPrice : {
    color : '#c40001',
  }
});
