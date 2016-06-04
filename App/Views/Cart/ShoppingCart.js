var React = require('react-native');

var ItemList = require('../../Component/ShoppingCart/ItemList');
var ItemDetail = require('../../Component/HappyPurchase/ItemDetail');
var Util = require('../../Common/Util');
var Tabs = require('../../Common/Tabs');

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
  getInitialState: function() {
    return {
      cateId : 0
    };
  },
  render: function() {
    var cateId = this.state.cateId;
    var userType = 1;
    var tabLink = 'http://list.tmall.com/search_product.htm?abbucket=&acm=lb-tms-1261802-40482.1003.8.316504&aldid=316504&q=%CA%D6%BB%FA&spm=a220m.1000858.a2227oh.d100&from=.list.pc_1_searchbutton&abtest=&type=p&scm=1003.8.lb-tms-1261802-40482.ITEM_1436707130731_316504&pos=1';
    var tabDataSource = [
      {code: 0, name: '方案'},
      {code: 1, name: '一元夺宝', link: tabLink, icon: ''}
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

        {/*购物车列表*/}
        <ItemList cateId={cateId} onSelect={(item)=>this.selectItem(item)}/>

      </View>
    );
  },
  //选中一行
	selectItem:function(item){
    //console.log(item);
		if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: '商品详情',
        component: ItemDetail,
        leftButtonTitle: '返回',
        navigationBarHidden:false,
        onLeftButtonPress: () => this.props.navigator.pop(),
        passProps: {
          item: item
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
