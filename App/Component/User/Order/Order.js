import React from 'react-native';
import Store from 'react-native-simple-store';

import OrderList from './List';
import ItemDetail from '../../../Component/HappyPurchase/ItemDetail';
import PlanDetail from '../../../Component/Plan/PlanDetail';
import Util from '../../../Common/Util';
import Tabs from '../../../Common/Tabs';

var {
  AppRegistry,
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
  getInitialState: function() {
    return {
      cateId: null,
      userType: null,
    };
  },
  componentDidMount(){
    Store.get('user').then((userdata)=>{
      let cid = 1;
      let utype = 0;
      if (userdata) {
        cid = userdata.user_type === 0 ? 1 : 0;
        utype = userdata.user_type;
      }
      this.setState({
        cateId: cid,
        userType: utype,
      })
    });
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

        {/*列表*/}
        <OrderList cateId={cateId} onSelect={(item)=>this.selectItem(item)}/>

      </View>
    );
  },
  //选中一行
	selectItem:function(item){
    this.props.navigator.push({
      title: item.plan_id ? '方案详情' : '商品详情',
      component: item.plan_id ? PlanDetail : ItemDetail,
      navigationBarHidden:false,
      passProps: {
        item: item,
        planId: item.plan_id,
      }
    });
	},
});

var css = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
