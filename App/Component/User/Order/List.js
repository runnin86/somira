//商品列表
'use strict';

import React from 'react-native';
import Store from 'react-native-simple-store';
import Button from 'react-native-button';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import Util from './../../../Common/Util';
import * as net from './../../../Network/Interface';

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
        Util.toast('您尚未登录');
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
      <View style={css.flex1}>
        <ListView contentInset={{top: 0,bottom:20}}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={css.listView}/>
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
});