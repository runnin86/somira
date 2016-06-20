'use strict';

import React, { Component } from 'react';
import Util from '../../../Common/Util';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image
} from 'react-native';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      dataSource:new ListView.DataSource({rowHasChanged:(row1,row2) =>row1!==row2}),
      loaded:false,
    };
  },
  componentDidMount: function() {
    this._getCouponList();
  },
  _getCouponList:function(){
    var thiz = this;
    var thizDataSource = thiz.state.dataSource;
    // Util.post(API.COUPONLIST,Global.user,
    //   function (ret){
    //     if(ret.code==0&&ret.data.length>0){
    //       thiz.setState({
    //           dataSource: thizDataSource.cloneWithRows(ret.data),
    //           loaded:true,
    //       });
    //     }else{
    //       alert("暂无红包");
    //       thiz.setState({loaded:true,});
    //     }
    //   });
  },
  _renderListItem:function(rowData){
    return (
      <View style={{padding:15,backgroundColor:'white',marginBottom:10}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{color:'#424242'}}>text1</Text>
          <Text style={{color:'#424242',marginLeft:20,}}>text2</Text>
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
         <Image style={styles.loading} source={require('image!loading')} />
         :
         null
       }
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderListItem}/>
     </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    marginTop : 62,
  },
  loading :{
    marginTop : 10,
    justifyContent: 'center',
    alignItems: 'center',
    height : 21,
    resizeMode: Image.resizeMode.contain,
    width: Util.size['width']
  },
});

AppRegistry.registerComponent('demo', () => demo);
