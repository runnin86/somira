//商品列表
'use strict';

import React from 'react-native';
import Store from 'react-native-simple-store';
import Button from 'react-native-button';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import Util from './../../../Common/Util';
import * as net from './../../../Network/Interface';
import Progress from './../../../Common/Progress';

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
      planListPageNum: 0,
      hpListPageNum: 0,
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
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
    });
    //拉取数据
    this.fetchData(nextProps.cateId);
  },
  //拉取数据
  fetchData: function(cateId) {
    // 方案
    if (cateId === 0) {
      this.getPlanList();
    }
    else if (cateId === 1) {
      // 乐夺宝
      this.getHpList();
    }
  },
  getPlanList() {
    Store.get('token').then((token)=>{
      if (token && this.state.planListPageNum > -1) {
        Util.post(net.planApi.myplan + '?pagenum=' + this.state.planListPageNum, token, {},
        ({code, msg, result})=>{
          if (code === 1) {
            this.setState({
              loaded: true,
              dataSource: this.state.dataSource.cloneWithRows(result.length>0?result:''),
              planListPageNum: result.length === 0?-1:this.state.planListPageNum+1
            });
          }
          else {
            Util.toast(msg);
          }
        });
      }
      else {
        Util.toast('您尚未登录!');
      }
    });
  },
  getHpList() {
    Store.get('user').then((userdata)=>{
      if (userdata.user_id && this.state.hpListPageNum > -1) {
        let param = '?userId=' + userdata.user_id + '&pagenum=' + this.state.hpListPageNum;
        Util.get(net.hpApi.userOneBuyOrder + param, '',
        ({code, msg, results})=>{
          if (code === 1) {
            this.setState({
              loaded: true,
              dataSource: this.state.dataSource.cloneWithRows(results.list.length>0?results.list:''),
              // hpListPageNum: results.list.length === 0?-1:this.state.hpListPageNum+1
            });
          }
          else {
            Util.toast(msg);
          }
        },
        (e)=>{
          console.error(e);
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
          <View style={[css.container,{backgroundColor:item.plan_result==='中奖'?'#FFFFF0':'#f9f9f9'}]}>
            <View style={css.goodRow}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:'100',fontSize:13}}>
                  {item.expert_name}
                </Text>
                <Text style={{fontWeight:'100',fontSize:10}}>
                  [{item.plan_name}]
                </Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <Image style={{width:14,height:14}} source={require('image!时间')} />
                <Text style={{fontWeight:'100',fontSize:11,marginLeft:2,}}>
                  {item.purchase_date}
                </Text>
              </View>
            </View>
            <View style={[css.goodRow,{alignSelf:'center',marginTop:8,marginBottom:8,backgroundColor:'rgba(0,152,50,0)'}]}>
              <Text style={[{fontWeight:'100',fontSize:14},item.plan_result==='中奖'?css.shadom:'']}>
                {item.plan_result===null?'等待开奖':item.plan_result}
              </Text>
            </View>
            <View style={[css.goodRow]}>
              <View style={css.planBottomLine}>
                <Text style={{fontWeight:'100',fontSize:10}}>
                  购买金额 {item.totalPrice}
                </Text>
              </View>
              <View style={[css.planBottomLine,{alignItems:'center'}]}>
                <Text style={{fontWeight:'100',fontSize:10}}>
                  倍数 {item.totalMultiple}
                </Text>
              </View>
              <View style={[css.planBottomLine,{alignItems:'flex-end'}]}>
                <Text style={{fontWeight:'100',fontSize:10}}>
                  收益 {
                    item.totalBonus>item.totalPrice
                    ?
                    Math.round(parseFloat(item.totalBonus-item.totalPrice)*100)/100
                    :
                    0
                  }
                </Text>
              </View>
            </View>
          </View>
          :
          <View style={[css.container,{flexDirection:'row'}]}>
            <Image style={{width: 60,height: 60,marginBottom: 10,marginRight: 4}}
              source={{uri: item.images?item.images.split(',')[0]:''}} />
            <View style={css.flex1}>
              <Text style={{fontSize: 14,fontWeight: '400',}} numberOfLines={1}>
                {'第'+item.number+'期 '+item.name}
              </Text>
              <Text style={{fontSize: 11,fontWeight: '100',marginTop:2,marginBottom:2,}} numberOfLines={1}>
                本期参与人次:{item.payCount}
              </Text>

              <View style={css.progress}>
                <Progress progress={(item.totalCount - item.remainingAmount) / item.totalCount}/>
              </View>
              <View style={css.goodRow}>
                <View>
                  <Text style={{fontWeight:'100',fontSize:10}}>总需</Text>
                  <Text style={css.redPrice}>
                    {item.totalCount}
                  </Text>
                </View>
                <View>
                  <Text style={{fontWeight:'100',fontSize:10}}>剩余</Text>
                  <Text style={css.whitePrice}>
                    {item.remainingAmount}
                  </Text>
                </View>
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
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomColor : '#eeeeee',
    borderBottomWidth : 1,
    backgroundColor: '#ffffff',
  },
  goodRow : {
  	flexDirection : 'row',
    justifyContent: 'space-between'
  },
  planBottomLine: {
    width: (Util.size['width']-20)/3,
  },
  shadom: {
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
    textShadowColor: '#FFD700',
  },
  redPrice : {
    fontSize : 12,
    color : '#c40001'
  },
  whitePrice : {
    fontSize : 12,
    color : '#b0b0b0'
  },
  progress: {
    marginTop: 10,
    marginBottom: 10
  },
});
