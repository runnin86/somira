'use strict';

import React from 'react';
import Store from 'react-native-simple-store';
import {CountDownText} from 'react-native-sk-countdown';
import Util from './../../Common/Util';
import * as net from './../../Network/Interface';

import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image
} from 'react-native';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged:(row1,row2) =>row1!==row2}),
      pageNum: 0,
      hpData: [],
      loaded: false,
    };
  },
  componentDidMount: function() {
    this._getRecordList();
  },
  _getRecordList:function(){
    if (this.state.pageNum > -1) {
      Util.get(net.hpApi.oneBuyNewPublic + '?pagenum=' + this.state.pageNum, '',
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
            pageNum: results.list.length === 0?-1:this.state.pageNum,
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
  _renderListItem:function(item){
    return (
      <View>
        <View style={[styles.cell,{flexDirection:'row'}]}>
          <Image style={{width: 60,height: 60,marginRight: 6,alignSelf:'center'}}
            source={{uri: item.images?item.images.split(',')[0]:''}} />
          <View style={styles.flex1}>
            <Text style={{fontSize: 14,fontWeight: '400',}} numberOfLines={1}>
              {'第'+item.number+'期 '+item.name}
            </Text>
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
                  <Text style={{color:'red'}}> {item.payCount}</Text>
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
                <Text style={{fontSize: 13,fontWeight: '100',textAlign:'center',marginTop:10,}} numberOfLines={1}>
                  揭晓倒计时
                </Text>
                <View style={styles.timeView}>
                  <CountDownText
                      style={styles.timeText}
                      countType='date' // 计时类型：seconds / date
                      auto={true} // 自动开始
                      afterEnd={() => {
                        this.setState({
                          loaded: false,
                          dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
                          hpData: [],
                          pageNum: 0,
                        });
                        this._getRecordList();
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
        </View>
      </View>
    );
  },
  render() {
    return (
     <View style={styles.container}>
       {
         !this.state.loaded
         ?
         Util.loading
         :
         (
           this.state.dataSource.getRowCount() === 0
           ?
           <View style={{marginTop:80,alignItems:'center',justifyContent: 'center'}}>
             <Image style={styles.warnning} source={require('image!温馨提示')}/>
             <Text style={{height:20,fontSize: 10,fontWeight:'100', color: '#A9A9A9'}}>
               揭晓内容敬请期待
             </Text>
           </View>
           :
           <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderListItem}/>
         )
       }
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    marginTop:66,
    marginBottom: 20,
  },
  warnning: {
    width: 100,
    backgroundColor: 'transparent',
    resizeMode:Image.resizeMode.contain,
  },
  recordRow : {
    flexDirection: 'row',
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
  },
  recordCell: {
    flex:1,
    height: 46,
    justifyContent : 'center'
  },
  recordCellFixed: {
    flex: 1,
    height: 46,
    justifyContent : 'center'
  },
  recordText: {
    fontSize: 12,
    fontWeight: '100',
    textAlign: 'center',
    margin: 10
  },
  red: {
    color: 'red',
  },
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
  cell: {
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
