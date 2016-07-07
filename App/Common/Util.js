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
  headerColor: '#000000',
  /*头部title颜色*/
  headerTitleColor: '#f0ffff',
  /*屏幕尺寸*/
  size: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  // delete请求
  delete: function (url, token, data, callback) {
    var fetchOptions = {
      method: 'delete',
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
    })
    .catch(error => {
      React.AlertIOS.alert(
        'Error',
        'There seems to be an issue connecting to the network.'
      );
    })
    .done();
  },
  // post请求
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
    })
    .catch(error => {
      React.AlertIOS.alert(
        'Error',
        'There seems to be an issue connecting to the network.'
      );
    })
    .done();
  },
  // get请求
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
      .catch(error => {
        React.AlertIOS.alert(
          'Error',
          'There seems to be an issue connecting to the network.'
        );
        // failCallback(error);
      })
  },
  // put请求
  put: function (url, token, data, callback) {
    var fetchOptions = {
      method: 'PUT',
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
    })
    .catch(error => {
      React.AlertIOS.alert(
        'Error',
        'There seems to be an issue connecting to the network.'
      );
    })
    .done();
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
      marginTop:Dimensions.get('window').height/2-250
    }}/>,
  /*获取时间差*/
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
  /*时间格式化*/
  dateFormat: (date, fmt) => {
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
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
      addPixelsY: y ? y : Dimensions.get('window').height * -0.34,
    });
  }
};
