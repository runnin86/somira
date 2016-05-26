//商品列表
'use strict';

var React = require('react-native');
var ItemCell = require('./ItemCell');
var Util = require('./../../Common/Util');
import * as net from './../../Network/Interface';

var {
  StyleSheet,
  ListView,
  Text,
  Image,
  View,
} = React;

module.exports = React.createClass({
    //object在组件被挂载之前调用。状态化的组件应该实现这个方法，返回初始的state数据。
    getInitialState() {
      return {
        dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
        loaded: false
      };
    },
    //只调用一次，在render之后调用
    componentDidMount() {
      this.fetchData();
    },
    //render 之前调用
    //之所以取nextProps的值而不直接取this.props.cateId 是因为componentWillReceiveProps的更新早于props的更新
    componentWillReceiveProps(nextProps) {
      //猫头先转
      this.setState({
          loaded : false
      })
      //拉取数据
      this.fetchData(nextProps.cateId);
    },
    //拉取数据
    fetchData: function(cateId) {
      let API = net.hpApi.home + (cateId> 0 ? '?price=' + cateId : '');
      fetch(API)
          .then((response) => response.json())
          .then(({code, msg, results}) => {
            if (code === 1) {
              this.setState({
                  dataSource: this.state.dataSource.cloneWithRows(results.list),
                  loaded: true
              });
            }
        }).catch((e) => {
          console.log('获取乐夺宝商品列表失败:' + e)
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
        <ListView contentInset={{top: 0}}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          style={css.listView}/>
      );
    },
    //渲染每一行
    renderRow(item) {
      return (
        <ItemCell item={item} onSelect={this.props.onSelect.bind(this,item)} />
      );
    },
  	render() {
  		return (
        this.renderListView()
      );
  	}
});

// 组件样式
var css = StyleSheet.create({
  loading :{
    marginTop : 10,
    justifyContent: 'center',
    alignItems: 'center',
    height : 21,
    resizeMode: Image.resizeMode.contain,
    width: Util.size['width']
  },
  listView : {
    // backgroundColor : '#ffffff'
  }
});
