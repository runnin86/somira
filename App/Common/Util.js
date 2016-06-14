/*!
 *
 * Util模块工具类
 * 主要提供工具方法
 *
 */
import React from 'react-native';
import Dimensions from 'Dimensions';

var {
  PixelRatio,
  ActivityIndicatorIOS,
  NativeModules,
} = React;

module.exports = {
  /*最小线宽*/
  pixel: 1 / PixelRatio.get(),
  /*头部背景色*/
  headerColor: 'DarkOrange',
  /*头部title颜色*/
  headerTitleColor: '#000000',
  /*屏幕尺寸*/
  size: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  //post请求
  post: function (url, token, data, callback) {
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-token': token,
      },
      body: JSON.stringify(data)
    };

    fetch(url, fetchOptions)
    .then((response) => response.text())
    .then((responseText) => {
      callback(JSON.parse(responseText));
      // callback(responseText);
    }).done();
  },
  /**
   * 基于fetch的请求方法
   */
  get: function (url, token, successCallback, failCallback) {
    var fetchOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-token': token,
      }
    };
    fetch(url, fetchOptions)
      .then((response) => response.text())
      .then((responseText) => {
        successCallback(JSON.parse(responseText));
      })
      .catch(function(err){
        console.log("错误信息:" + err);
        failCallback(err);
      });
  },
  log:function (obj){
    var description = "";
    for(var i in obj){
      var property=obj[i];
      description+=i+" = "+property+"\n";
    }
    alert(description);
  },
  /*loading效果*/
  loading: <ActivityIndicatorIOS color="#3E00FF"
    style={{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      marginTop:Dimensions.get('window').height/2-150
    }}/>,
  getDateDiff: (startTime, endTime, diffType) => {
    // 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
    startTime = startTime.replace(/\-/g, '/')
    endTime = endTime.replace(/\-/g, '/')
    // 将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase()
    var sTime = new Date(startTime) // 开始时间
    var eTime = new Date(endTime)   // 结束时间
    // 作为除数的数字
    var divNum = 1
    switch (diffType)
    {
      case 'second':
        divNum = 1000
        break
      case 'minute':
        divNum = 1000 * 60
        break
      case 'hour':
        divNum = 1000 * 3600
        break
      case 'day':
        divNum = 1000 * 3600 * 24
        break
      default:
        break
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseFloat(divNum, 0), 0)
  },
  /*
   * m:消息
   * d:显示时间长短
   * p:显示位置
   * y:竖轴位移
   */
  toast: (m, d, p, y) => {
    NativeModules.Toast.show({
      message: m,
      duration: d ? d : 'short',//[short,long]
      position: p ? p : 'bottom',//[top,center,bottom]
      addPixelsY: y ? y : -56,
    });
  }
};
