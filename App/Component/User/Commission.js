'use strict';

import React from 'react';
import Store from 'react-native-simple-store';
import Button from 'react-native-button';
import md5 from 'md5';
import Util from '../../Common/Util';
import * as net from '../../Network/Interface';

import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  AlertIOS,
} from 'react-native';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({rowHasChanged:(row1,row2) =>row1!==row2}),
      loaded: false,
      withDrawLength: 0,
      withDrawMoney: 0,
    };
  },
  componentDidMount: function() {
    this._getRecordList();
  },
  _getRecordList:function(){
    Store.get('token').then((token)=>{
      if (token) {
        Util.post(net.userApi.commission, token, {},
        ({code, msg, result})=>{
          if (code === 1) {
            let tempLength = 0;
            let tempMoney = 0;
            result.map((v, k)=>{
              if (v.commissionStatus === 4) {
                // commissionStatus:1已提现 2:提现审核中 3:未达标 4:可提现
                tempLength += 1;
                tempMoney += v.total_fee;
              }
            });
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(result.length > 0?result:''),
              loaded: true,
              withDrawLength: tempLength,
              withDrawMoney: tempMoney
            });
          }
          else {
            Util.toast(msg);
          }
        });
      }
    });
  },
  _renderListItem:function(rowData){
    // console.log(rowData);
    return (
      <View style={styles.recordRow}>
        <View style={[styles.recordCellFixed,{alignItems: 'flex-start',marginLeft:10,}]}>
          <Text style={[{fontWeight : '100',fontSize : 15},rowData.commissionStatus===4?styles.red:styles.gray]}>
            {rowData.from_user_phone}
            <Text style={{fontWeight : '100',fontSize : 12}}>
              ({rowData.commissionStatus===4
                ?
                '可提现'
                :
                (rowData.commissionStatus===1
                  ?
                  '已提现'
                  :
                  (rowData.commissionStatus===2
                    ?
                    '审核中'
                    :
                    rowData.commissionStatus===3
                    ?
                    '未达标'
                    :
                    ''
                  )
                )
              })
            </Text>
          </Text>
          <Text style={[{fontWeight : '100',fontSize : 12},rowData.commissionStatus===4?styles.red:styles.gray]}>
            用户所属:{rowData.oneLevelPhone === ''?'':'上级' + rowData.oneLevelPhone}
            {rowData.oneLevelPhone === ''?'直属上级':''}
          </Text>
        </View>
        <View style={[styles.recordCellFixed,{alignItems:'flex-end'}]}>
          <Text style={[styles.recordText,rowData.commissionStatus===4?styles.red:styles.gray]}>
            {rowData.total_fee}
          </Text>
        </View>
			</View>
    );
  },
  doWithDraw() {
    if (this.state.withDrawLength === 0 && this.state.withDrawMoney === 0) {
      Util.toast('可提现金额为0');
      return
    }
    Store.get('user').then((user)=>{
      AlertIOS.alert(
        '密码验证',
        '为了保障财产安全,请输入您的登录密码',
        [{
           text: '确认',
           onPress: (text)=>{
             if (md5(text) === user.user_pass) {
               AlertIOS.alert(
                 '确认',
                 '提取所有佣金:' + this.state.withDrawMoney + '元?',
                 [{
                    text: '确认',
                    onPress: ()=>{
                      Store.get('token').then((token)=>{
                        Util.post(net.userApi.withdraw, token, {
                          wtype: '2',
                          wmoney: this.state.withDrawMoney
                        },
                        ({code, msg, result})=>{
                          if (code === 1) {
                            Util.toast('恭喜您，提现成功!\n工作人员会在3个工作日内与您联系');
                            this._getRecordList();
                          }
                          else {
                            Util.toast('提现失败:' + msg);
                          }
                        });
                      });
                    },
                    style: 'destructive',
                 }, {
                    text: '取消',
                    style: 'cancel',
                 }]);
             } else {
               Util.toast('输入密码错误');
             }
           },
           style: 'destructive',
        }, {
           text: '取消',
           style: 'cancel',
        }],
        'secure-text'
      )
    });
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
               您还没有返佣
             </Text>
           </View>
           :
           <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderListItem}/>
         )
       }

       {
         this.state.dataSource.getRowCount() === 0
         ?
         null
         :
         <View style={[styles.bottomArea]}>
           <View style={styles.flex1}>
             <Text style={[styles.bottomText,
               this.state.cateId === 0
               ?
               {color: 'red'}
               :
               {color: '#000000'}
             ]}>
               共 {this.state.withDrawLength} 条可提现,
               总额 {this.state.withDrawMoney}
             </Text>
           </View>
           <View style={[styles.flex1],{width:68}}>
             <Button onPress={this.doWithDraw}
               style={[styles.bottomBtn,{backgroundColor: '#4cd964'}]}>
               提现
             </Button>
           </View>
         </View>
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
    marginBottom: -20,
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
    height: 60,
    justifyContent : 'center'
  },
  recordText: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    margin: 10
  },
  red: {
    color: '#FF4500',
  },
  gray: {
    color: '#DCDCDC',
  },
  priceBtn: {
    height:38,
    width:38,
  },
  bottomArea: {
    flexDirection: 'row',
    marginTop:-16,
    marginBottom:20,
    height:48,
    overflow:'hidden',
    backgroundColor: '#FFFFF0',
  },
  bottomText: {
    alignSelf:'flex-start',
    height:36,
    lineHeight: 32,
    marginLeft: 10,
  },
  bottomBtn: {
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
  flex1 : {
    flex : 1,
  },
});
