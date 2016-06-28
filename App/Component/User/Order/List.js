//商品列表
'use strict';

import React from 'react-native';
import Store from 'react-native-simple-store';
import Button from 'react-native-button';
import {CountDownText} from 'react-native-sk-countdown';
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
      planListPageNum: 1,
      hpListPageNum: 0,
      planData: [],
      hpData: [],
      uid: '',
    };
  },
  //只调用一次，在render之后调用
  componentDidMount() {
    console.log(this.state.userdata);
    this.fetchData(this.props.cateId);
  },
  //render 之前调用
  //之所以取nextProps的值而不直接取this.props.cateId 是因为componentWillReceiveProps的更新早于props的更新
  componentWillReceiveProps(nextProps) {
    // 不相等则表明切换tab,需要切换展示数据
    if (nextProps.cateId !== this.state.cateId) {
      //猫头先转
      this.setState({
        loaded: false,
        cateId: nextProps.cateId,
        dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
        planData: [],
        planListPageNum: 1,
        hpData: [],
        hpListPageNum: 0,
      });
      //拉取数据
      this.fetchData(nextProps.cateId);
    }
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
  loadMore() {
    let pNum = this.state.planListPageNum;
    let hNum = this.state.hpListPageNum;
    this.setState({
      planListPageNum: pNum !== -1 ? pNum + 1 : -1,
      hpListPageNum: hNum !== -1 ? hNum + 1 : -1,
    });
    if (this.state.cateId === 1) {
      //方案不存在分页,无需分页加载数据
      this.fetchData(this.state.cateId);
    }
  },
  getPlanList() {
    Store.get('token').then((token)=>{
      if (token && this.state.planListPageNum > -1) {
        Util.post(net.planApi.myplan + '?pagenum=' + this.state.planListPageNum, token, {},
        ({code, msg, result})=>{
          // console.log(this.state.planListPageNum + '->' + result.length + '->' + this.state.dataSource.getRowCount());
          if (code === 1) {
            // 数据填充
            if (result.length>0) {
              result.map((v,k) => {
                this.state.planData.push(v);
              });
            }
            this.setState({
              loaded: true,
              dataSource: this.state.dataSource.cloneWithRows(this.state.planData),
              planListPageNum: result.length === 0?-1:this.state.planListPageNum
            });
          }
          else {
            Util.toast(msg);
          }
        });
      }
      else {
        Util.toast('没有更多数据了!');
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
            // 数据填充
            if (results.list.length>0) {
              results.list.map((v,k) => {
                this.state.hpData.push(v);
              });
            }
            this.setState({
              loaded: true,
              dataSource: this.state.dataSource.cloneWithRows(this.state.hpData),
              hpListPageNum: results.list.length === 0?-1:this.state.hpListPageNum,
              uid: userdata.user_id,
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
  /*
   * 是否展示倒计时
   */
  isShowTime(pubTime) {
    let now = Util.dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss');
    // 获得开奖时间和现在时间的时间差(秒)
    let m = Util.getDateDiff(now, pubTime, 'second');
    // m = 10;
    if (m > 0) {
      // 展示倒计时
      return {show: true, time: m}
    }
    else {
      // 展示结果
      return {show: false, time: pubTime}
    }
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
                您还没有方案记录,赶快去购买方案吧
              </Text>
              :
              <Text style={{height:20,fontSize: 10, color: 'gray'}}>
                您还没有一元夺宝记录,赶快去夺宝吧
              </Text>
            }
          </View>
          :
          null
        }
        <ListView contentInset={{top: 0,bottom:0}}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          pageSize={10}
          onEndReached={this.loadMore}
          onEndReachedThreshold={1}
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
            <Image style={{width: 60,height: 60,marginRight: 6,alignSelf:'center'}}
              source={{uri: item.images?item.images.split(',')[0]:''}} />
            <View style={css.flex1}>
              <Text style={{fontSize: 14,fontWeight: '400',}} numberOfLines={1}>
                {'第'+item.number+'期 '+item.name}
              </Text>
              <Text style={{fontSize: 11,fontWeight: '100',marginTop:2,marginBottom:2,}} numberOfLines={1}>
                本期参与人次:{item.payCount}
              </Text>
              {
                // 进行中的展示
                item.status === '1'
                ?
                <View>
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
                :
                null
              }
              {
                // 已揭晓的展示
                item.status === '0' && !this.isShowTime(item.publicTime).show
                ?
                <View>
                  <Text style={{fontSize: 10,fontWeight: '100'}} numberOfLines={1}>
                    中奖号码:
                    <Text style={{color:'red'}}> {item.luckCode}</Text>
                  </Text>
                  <Text style={{fontSize: 10,fontWeight: '100'}} numberOfLines={1}>
                    获奖者: {item.user_name}
                  </Text>
                  <Text style={{fontSize: 10,fontWeight: '100'}} numberOfLines={1}>
                    人次:
                    <Text style={{color:'red'}}> {item.userPayCount}</Text>
                  </Text>
                  <Text style={{fontSize: 10,fontWeight: '100'}} numberOfLines={1}>
                    日期: {item.publicTime}
                  </Text>
                </View>
                :
                null
              }
              {
                // 倒计时的展示
                item.status === '0' && this.isShowTime(item.publicTime).show
                ?
                <View>
                  <Text style={{fontSize: 13,fontWeight: '100',textAlign:'center',marginTop:10}} numberOfLines={1}>
                    揭晓倒计时
                  </Text>
                  <View style={css.timeView}>
                    <CountDownText
                        style={css.timeText}
                        countType='date' // 计时类型：seconds / date
                        auto={true} // 自动开始
                        afterEnd={() => {
                          this.setState({
                            loaded: false,
                            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
                            hpData: [],
                            hpListPageNum: 0,
                          });
                          this.getHpList();
                        }} // 结束回调
                        timeLeft={this.isShowTime(item.publicTime).time} // 正向计时 时间起点为0秒
                        step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                        startText='' // 开始的文本
                        endText='' // 结束的文本
                        intervalText={
                          (date, hour, min, sec) => min + '分' + sec + '秒'
                        }// 定时的文本回调
                      />
                  </View>
                </View>
                :
                null
              }
            </View>
            {
              // 已揭晓->是否中奖展示
              item.status === '0' && !this.isShowTime(item.publicTime).show
              ?
              <Image style={{width: 32,height: 32,alignSelf:'center'}}
                source={{uri: item.userId===this.state.uid?'中奖':'未中奖'}} />
              :
              null
            }
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
    borderBottomColor : '#C0C0C0',
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
  timeView: {
    padding: 8,
    marginTop:8,
    backgroundColor: 'red',
    borderRadius: 8,
  },
  timeText: {
    textAlign:'center',
    color:'white',
    fontSize:14,
    fontWeight: '500'
  },
});
