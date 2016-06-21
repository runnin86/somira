import React from 'react-native';

import ItemList from '../../Component/ShoppingCart/ItemList';
import ItemDetail from '../../Component/HappyPurchase/ItemDetail';
import PlanDetail from '../../Component/Plan/PlanDetail';
import Util from '../../Common/Util';
import Tabs from '../../Common/Tabs';

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform
} = React;

module.exports = React.createClass({
  componentWillReceiveProps() {
  },
  getInitialState: function() {
    return {
      cateId : 0
    };
  },
  render: function() {
    var cateId = this.state.cateId;
    var userType = 1;
    var tabDataSource = [
      {code: 0, name: '方案'},
      {code: 1, name: '一元夺宝', link: '', icon: ''}
    ];
    return (
      <View style={[css.flex,{marginTop:62}]}>
        {/*用户区分是否展示tab*/}
        {
          userType===1
          ?
          <Tabs
            initData={{tabDataSource}}
            updateCateItem={
              (cateId)=>this.setState({cateId : cateId})
            }/>
          :
          <View></View>
        }

        {/*列表*/}
        <ItemList cateId={cateId} onSelect={(item)=>this.selectItem(item)}/>

      </View>
    );
  },
  //选中一行
	selectItem:function(item){
    this.props.navigator.push({
      title: item.pid ? '方案详情' : '商品详情',
      component: item.pid ? PlanDetail : ItemDetail,
      leftButtonTitle: '返回',
      navigationBarHidden:false,
      onLeftButtonPress: () => this.props.navigator.pop(),
      passProps: {
        item: item,
        planId: item.pid,
      }
    });
	},
});

var css = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
