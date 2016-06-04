//通用tab标签页
'use strict';
import React from 'react-native';
import Util from './Util';
var maxTabLength = 4;

var {
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  View,
  ScrollView
} = React;

//单个Item
var ItemTab = React.createClass({
  render() {
    var item = this.props.item;
    return(
      <View style={css.itemTab}>item.text</View>
    );
  }
})

module.exports = React.createClass({
  //默认值
  getDefaultProps() {
    return {
      api : 'http://www.tmall.com/go/rgn/3c/wh-fp-m-index-teh.php?1'
    }
  },
  //object在组件被挂载之前调用。
  getInitialState() {
    return {
      dataSource: this.props.initData.tabDataSource,
      activeCatId : 0
    };
  },
  //分类切换事件
  handleCateChange(cateId) {
    this.setState({
      activeCatId : cateId
    });

    //判断下父级是否实现了updateCateItem 方法
    this.props.updateCateItem && this.props.updateCateItem(cateId);
  },
  //渲染单个tab
  renderItems(data) {
    var me = this;
    var tabWidth = Util.size['width']/(me.state.dataSource.length>maxTabLength?maxTabLength:me.state.dataSource.length);
    return data.map(function(item,i){
      //样式修改
      var style = me.state.activeCatId == item.code ? css.itemActiveTab : {},
          styleTxt = me.state.activeCatId == item.code ? css.itemActiveText : {};
      return(
        <TouchableWithoutFeedback key={item.code} onPress={() => me.handleCateChange(item.code)}>
          <View style={[css.itemTab,css.tabContainer,style,{width: tabWidth}]} key={i}>
            <Text style={[css.itemText,styleTxt]}>{item.name}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    })
  },
  render() {
    var data = this.state.dataSource || [];
    //超过最大的tab个数时,采用ScrollView
    return (
      <View style={{flexDirection : 'row'}}>
      {
        data.length<=maxTabLength
        ?
        this.renderItems(data)
        :
        <ScrollView ref="scrollView" contentInset={{top: 0}} showsHorizontalScrollIndicator={true}
          style={css.tabContainer} contentContainerStyle={css.contentStyle} horizontal={true}>
          {this.renderItems(data)}
        </ScrollView>
      }
      </View>
    );
  }
});

// 组件样式
var css = StyleSheet.create({
  itemTab :{
    justifyContent: 'center',
    height : 40,
    paddingLeft : 6,
    paddingRight : 6,
    borderBottomWidth : 3,
    borderBottomColor : '#F5FCFF',
  },
  //选中状态
  itemActiveTab : {
    borderBottomWidth : 3,
    borderBottomColor : '#D91D36'
  },
  itemText : {
    color : '#757575',
    fontSize : 14,
    textAlign: 'center'
  },
  itemActiveText : {
    color : '#D91D36',
    fontSize : 14,
    fontWeight : '700'
  },
  contentStyle : {
    flex : 1,
    flexDirection : 'row',
    justifyContent: 'center',
  },
  tabContainer: {
    flex : 1,
    height : 40,
    borderBottomColor : '#eeeeee',
    borderBottomWidth : 1,
    borderTopColor : '#eeeeee',
    borderTopWidth : 1,
    backgroundColor: '#F5FCFF',
    marginTop: 0
  }
});
