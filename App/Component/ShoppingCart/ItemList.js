//商品列表
'use strict';

import React from 'react-native';
import Store from 'react-native-simple-store';
import Button from 'react-native-button';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import Util from './../../Common/Util';
import * as net from './../../Network/Interface';

var {
  StyleSheet,
  ListView,
  Text,
  Image,
  View,
  Platform,
  TouchableOpacity,
} = React;

module.exports = React.createClass({
  //object在组件被挂载之前调用。状态化的组件应该实现这个方法，返回初始的state数据。
  getInitialState() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      loaded: false,
      cateId: 0,
      totalPrice: 0,
    };
  },
  //只调用一次，在render之后调用
  componentDidMount() {
    this.fetchData(this.props.cateId);
  },
  //render 之前调用
  //之所以取nextProps的值而不直接取this.props.cateId 是因为componentWillReceiveProps的更新早于props的更新
  componentWillReceiveProps(nextProps) {
    //猫头先转
    this.setState({
      loaded: false,
      cateId: nextProps.cateId,
    })
    //拉取数据
    this.fetchData(nextProps.cateId);
  },
  //拉取数据
  fetchData: function(cateId) {
    // 获取购物车,需要token数据
    Store.get('token').then((token)=>{
      if (token) {
        // 方案
        if (cateId === 0) {
          Util.post(net.planApi.queryCart, token, {},
          ({code, msg, result})=>{
            // 计算总价
            let tempPrice = 0
            result.map((p, key)=>{
              tempPrice += p.amount*p.planAmount;
            });
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(code === 1?result:''),
              totalPrice: tempPrice,
              loaded: true
            });
          });
        }
        else if (cateId === 1) {
          // 乐夺宝
          Util.get(net.hpApi.redisCart, token,
          ({code, msg, info})=>{
            // 计算总价
            let tempPrice = 0
            info.map((h, key)=>{
              tempPrice += h.amount;
            });
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(code === 1?info:''),
              totalPrice: tempPrice,
              loaded: true
            });
          },
          (e)=>{
            console.error(e);
          });
        }
      }
      else {
        Util.toast('您尚未登录!');
      }
    });
  },
  // 购物车提交
  payCart() {
    Store.get('token').then((token)=>{
      if (token) {
        /*
         * cateId=0为方案支付;cateId=1为乐夺宝支付;
         */
        if (this.state.cateId === 0) {
          // {"planbinfo":{"totalmoney":2.0,
          //  "spcarlist":[{"multipy":1,"name":"飞鹰计划","pid":"31","sum":2.0}]}}
          // 刷新购物车
          this.fetchData(0);
          // 购物车方案数组
          let spcarlist = [];
          this.state.dataSource._dataBlob.s1.map((p, key)=>{
            spcarlist.push({
              'multipy': p.amount,
              'name': p.expertName,
              'pid': p.pid,
              'sum': p.amount * p.planAmount
            });
          });
          // 组装请求消息体
          let postBody = {
            'planbinfo': {
              'totalmoney': this.state.totalPrice,
              'spcarlist': spcarlist
            }
          };
          // 发起支付请求
          Util.post(net.planApi.cartPay, token, postBody,
          ({code, msg, result})=>{
            if (code === 1) {
              Util.toast('购买成功!');
              // 重新拉取数据
              this.fetchData(0);
            }
            else if (code === 2) {
              // 结算异常
              Util.toast(msg);
            }
            else if (code === 0) {
              let errObj = result[0];
              let errorTips = errObj.expert_name ? '专家[' + errObj.expert_name + '],' : '' + errObj.msg;
              Util.toast(errorTips);
            }
          });
        }
        else if(this.state.cateId === 1) {
          // 刷新购物车
          this.fetchData(1);
          // 购物车商品数组
          let spcarlist = [];
          this.state.dataSource._dataBlob.s1.map((h, key)=>{
            spcarlist.push({
              'name': h.name,
              'number': h.number,
              'payCount': h.amount,
              'projectId': h.id,
              'recharge_money': h.amount
            });
          });
          // 组装请求消息体
          let postBody = {
            'spcarInfos': {
              'totalmoney': this.state.totalPrice,
              'spcarlist': spcarlist
            }
          }
          // 发起支付请求
          Util.post(net.hpApi.cartPay, token, postBody,
          ({code, msg})=>{
            if (code === 1) {
              Util.toast('购买成功!');
              // 重新拉取数据
              this.fetchData(1);
            }
            else {
              Util.toast(msg);
            }
          });
        }
      }
    });
  },
  /*
   * ------------------------方案相关---------------------------
   */
  delCartHP(id, number) {
    Store.get('token').then((token)=>{
      if (token) {
        let url = net.hpApi.redisCart + '/' + id + '_' + number;
        Util.delete(url, token, {},
        ({code, msg})=>{
          if (code === 1) {
            //拉取数据
            this.fetchData(1);
            // 设置购物车图标
            RCTDeviceEventEmitter.emit('loadCartCount');
          }
          else {
            Util.toast(msg);
          }
        });
      }
    });
  },
  augmentPlan(plan) {
    // 数量相加
    this.changeAmountPlan(plan, parseFloat(plan.amount) + 1);
  },
  reducePlan(plan) {
    // 数量加减
    if (parseFloat(plan.amount) - 1 >= 1) {
      this.changeAmountPlan(plan, parseFloat(plan.amount) - 1);
    }
  },
  changeAmountPlan (plan, amount) {
    Store.get('token').then((token)=>{
      if (token) {
        Util.post(net.planApi.upCart, token, {
          'pid': plan.pid,
          'amt': amount
        },
        ({code, msg, result})=>{
          if (code === 1) {
            // 重新拉取数据
            this.fetchData(0);
          }
          else {
            Util.toast(msg);
          }
        });
      }
    });
  },
  /*
   * ------------------------乐夺宝相关---------------------------
   */
  delCartPlan(id) {
    // Body :{"dellist":[{"pid":"1ee6d76ff3094c8a82b948def322da58"}]}
    // 组装请求消息体
    let deleteBody = {
      'dellist': [{'pid': id}]
    };
    Store.get('token').then((token)=>{
      if (token) {
        Util.delete(net.planApi.delCart, token, deleteBody,
        ({code, msg})=>{
          if (code === 1) {
            //拉取数据
            this.fetchData(0);
            // 设置购物车图标
            RCTDeviceEventEmitter.emit('loadCartCount');
          }
          else {
            Util.toast(msg);
          }
        });
      }
    });
  },
  augmentHP(item) {
    // 数量相加
    let augmentAmount = item.amount + item.price
    this.changeAmountHP(item, augmentAmount)
  },
  reduceHP(item) {
    // 数量加减
    if ((item.amount - item.price) >= item.price) {
      this.changeAmountHP(item, item.amount - item.price)
    }
  },
  changeAmountHP(item, amount) {
    Store.get('token').then((token)=>{
      if (token) {
        Util.put(net.hpApi.redisCart + '/' + item.id, token, {
          'number': item.number,
          'amount': amount
        },
        ({code, msg})=>{
          if (code === 1) {
            // 重新拉取数据
            this.fetchData(1);
          }
          else {
            Util.toast(msg);
          }
        });
      }
    });
  },
  //渲染列表
  renderListView : function(){
    //先展示加载中的菊花
    if(!this.state.loaded){
      return(
        <Image style={css.loading} source={require('image!loading')} />
      );
    };
    return(
      <View style={[css.flex1,{backgroundColor:'#eeeeee',}]}>
        {
          this.state.dataSource.getRowCount() ===0
          ?
          <View style={{alignItems:'center',marginTop:40,}}>
            <Image style={{width: 120,resizeMode:Image.resizeMode.contain,}}
              source={require('image!温馨提示')}/>
            {
              this.state.cateId === 0
              ?
              <Text style={{height:20,fontSize: 10, color: 'gray'}}>
                购物车空空如也,赶快去购买方案吧
              </Text>
              :
              <Text style={{height:20,fontSize: 10, color: 'gray'}}>
                购物车空空如也,赶快去夺宝吧
              </Text>
            }
          </View>
          :
          null
        }
        <ListView contentInset={{top: 0,bottom:20}}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={css.listView}/>
        {
          this.state.dataSource.getRowCount()>0
          ?
          <View style={[css.payArea]}>
            <View style={css.flex1}>
              <Text style={[css.payText,
                this.state.cateId === 0
                ?
                {color: 'red'}
                :
                {color: '#000000'}
              ]}>
                共 {this.state.dataSource.getRowCount()} 件{this.state.cateId === 0?'方案':'商品'},
                总计 {this.state.totalPrice} 元
              </Text>
            </View>
            <View style={[css.flex1],{width:68}}>
              <Button onPress={this.payCart}
                style={[css.payBtn,
                  this.state.cateId === 0
                  ?
                  {backgroundColor: 'red'}
                  :
                  {backgroundColor: '#0894ec'}
                ]}>
                付款
              </Button>
            </View>
          </View>
          :
          null
        }
      </View>
    );
  },
  //渲染每一行
  renderRow(item) {
    return (
      <TouchableOpacity onPress={this.props.onSelect.bind(this,item)}>
          {
            this.state.cateId === 0
            ?
            <View style={[css.row,css.container]}>
              <View style={css.column}>
                <Image style={[css.left10,css.bottom10,css.right4,{width: 42,height: 48,}]}
                  source={{uri: item.expertHead}} />
                <Text style={[css.fontWeightBold,css.fontSize14,{alignSelf:'center',marginTop:-6,}]}
                  numberOfLines={1}>
                  {item.expertName}
                </Text>
              </View>
              <View style={css.flex1}>
                <View style={[css.row,css.left10,css.right15,css.bottom4]}>
                  <Text style={[css.fontWeight,css.fontSize14]}>
                    {item.planName}
                  </Text>
                  <Text style={[css.fontWeight2,css.fontSize12,css.flex1,css.textRight]}>
                    {item.addTime}
                  </Text>
                </View>
                <View style={[css.row,css.left10,css.right15,css.bottom4]}>
                  <View style={[css.row,css.center2]}>
                    <Button onPress={()=>this.reducePlan(item)}>
                      <Image style={css.priceBtn} source={require('image!ic_goods_reduce')}/>
                    </Button>
                    <Text style={css.priceText}>{item.amount}</Text>
                    <Button onPress={()=>this.augmentPlan(item)}>
                      <Image style={css.priceBtn} source={require('image!ic_goods_add')}/>
                    </Button>
                  </View>
                  <Text style={[css.fontWeightBold,css.fontSize14,css.left20,css.center]}>
                    <Text style={css.red}>
                      {item.amount*item.planAmount}
                    </Text>
                    元
                  </Text>
                  <Button onPress={()=>this.delCartPlan(item.pid)}>
                    <Image style={[css.delBtn,{right:-30}]} source={require('image!删除')} />
                  </Button>
    						</View>
                <View style={[css.row,css.left10,css.right15,css.bottom4,css.top4]}>
                  <View style={css.row}>
                    <Image style={[css.right4,{width: 12,height: 12}]}
                      source={require('image!方案详情-收益区')} />
                    <Text style={[css.fontWeight,css.fontSize12]}>
                      {item.rangeName}
                    </Text>
                  </View>
                  <View style={[css.row,{right:-40,}]}>
                    <Image style={[css.right4,{width: 10,height: 14,}]}
                      source={require('image!单价')} />
                    <Text style={[css.fontWeight,css.fontSize12,css.flex1]}>
                      {item.planAmount}元
                    </Text>
                  </View>
                </View>
    					</View>
    				</View>
            :
            <View style={[css.row,css.container]}>
              <Image style={[css.bottom10,css.right4,{width: 60,height: 60,}]}
                source={{uri: item.images?item.images.split(',')[0]:''}} />
              <View style={css.flex1}>
                <Text style={[css.fontWeightBold,{fontSize: 14}]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[css.fontWeight,{fontSize: 9,marginTop:2,marginBottom:2,}]} numberOfLines={1}>
                  {item.content}
                </Text>
                <View style={[css.row,css.top4]}>
                  <Button onPress={()=>this.reduceHP(item)}>
                    <Image style={css.priceBtn} source={require('image!ic_goods_reduce')}/>
                  </Button>
                  <Text style={[css.center,css.priceText]}>{item.amount}</Text>
                  <Button onPress={()=>this.augmentHP(item)}>
                    <Image style={css.priceBtn} source={require('image!ic_goods_add')}/>
                  </Button>
                  <Button onPress={()=>this.delCartHP(item.id, item.number)}>
                    <Image style={[css.delBtn,{right:-70}]} source={require('image!删除')} />
                  </Button>
                </View>
                <View style={[css.row,css.top4]}>
                  <Text style={[css.fontWeightBold,css.fontSize12]}>
                    需:
                    <Text style={css.red}>
                      {item.amount}
                    </Text>
                    元
                  </Text>
                  <Text style={[css.fontWeight,css.fontSize12,css.flex1,css.textCenter]}>
                    总价:{item.totalCount}元
                  </Text>
                </View>
              </View>
            </View>
          }
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
// borderColor:'#3164ce',//#b0b0b0,#c40001
var css = StyleSheet.create({
  loading :{
    marginTop : 10,
    justifyContent: 'center',
    alignItems: 'center',
    height : 21,
    resizeMode: Image.resizeMode.contain,
    width: Util.size['width']
  },
  flex1 : {
    flex : 1,
  },
  listView : {
    backgroundColor : '#eeeeee'
  },
  container: {
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomColor : '#eeeeee',
    borderBottomWidth : 1,
    backgroundColor: '#ffffff',
  },
  center: {
    alignSelf:'center',
    justifyContent:'center',
  },
  center2: {
    alignItems:'center',
    justifyContent:'center',
  },
  delBtn: {
    height: 40,
    width: 40,
    borderWidth: 0.5,
    borderColor : '#778899',
    borderRadius : 20,
  },
  fontWeight: {
    fontWeight: '100'
  },
  fontWeightBold: {
    fontWeight: '400',
  },
  fontSize14: {
    fontSize: 14
  },
  fontSize12: {
    fontSize: 12
  },
  textRight: {
    textAlign:'right'
  },
  textCenter: {
    textAlign:'center'
  },
  red: {
    color: 'red'
  },
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  left10: {
    marginLeft: 10
  },
  left20: {
    marginLeft: 20
  },
  right15: {
    marginRight: 15
  },
  right4: {
    marginRight: 4
  },
  bottom4: {
    marginBottom: 4
  },
  bottom10: {
    marginBottom: 10
  },
  top4: {
    marginTop:4
  },
  priceText: {
    color:'#f28006',
    paddingLeft:20,
    paddingRight:20,
  },
  priceBtn: {
    height:38,
    width:38,
  },
  payArea: {
    flexDirection: 'row',
    marginTop:-16,
    marginBottom:50,
    height:48,
    overflow:'hidden',
    backgroundColor: '#FFFFF0',
  },
  payText: {
    alignSelf:'flex-start',
    height:36,
    lineHeight: 32,
    marginLeft: 10,
  },
  payBtn: {
    color: '#FFFFFF',
    alignSelf:'flex-end',
    margin:4,
    marginRight:10,
    width: 68,
    height:42,
    lineHeight: 32,
    overflow:'hidden',
    borderWidth : 1,
    borderRadius:10,
    borderColor: '#FFFFFF',
  },
});
