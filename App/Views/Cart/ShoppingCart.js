import React from 'react-native';
import Store from 'react-native-simple-store';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

import ItemList from '../../Component/ShoppingCart/ItemList';
import ItemDetail from '../../Component/HappyPurchase/ItemDetail';
import PlanDetail from '../../Component/Plan/PlanDetail';
import Util from '../../Common/Util';
import Tabs from '../../Common/Tabs';

var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform
} = React;

module.exports = React.createClass({
  componentWillReceiveProps() {
  },
  componentDidMount(){
    Store.get('user').then((userdata)=>{
      if (userdata) {
        this.setState({
          userType:userdata.user_type,
          cateId:userdata.user_type===0?1:0
        })
      }
    });
  },
  getInitialState: function() {
    return {
      cateId: 1,
      userType: 0,
    };
  },
  render: function() {
    var cateId = this.state.cateId;
    var tabDataSource = [
      this.state.userType===1?{code: 0, name: '方案'}:{},
      {code: 1, name: '一元夺宝', link: '', icon: ''}
    ];
    return (
      <View style={[css.flex,{marginTop:62}]}>
        {/*用户区分是否展示tab*/}
        {
          this.state.userType===1
          ?
          <Tabs
            initData={{tabDataSource}}
            updateCateItem={
              (cateId)=>this.setState({cateId : cateId})
            }/>
          :
          <View></View>
        }

        {/*购物车列表*/}
        <ItemList cateId={cateId} onSelect={(item)=>this.selectItem(item)}/>

      </View>
    );
  },
  //选中一行
	selectItem:function(item){
		if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: item.pid ? '方案详情' : '商品详情',
        component: item.pid ? PlanDetail : ItemDetail,
        navigationBarHidden:false,
        passProps: {
          item: item,
          planId: item.pid,
        }
      });
		}else{
			//android对应的处理
		}
	},
});

var css = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
