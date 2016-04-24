var React = require('react-native');

var ItemList = require('../../Component/ShoppingCart/ItemList');
var ItemDetail = require('../../Component/ShoppingCart/ItemDetail');
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
  _pop: function(msg){
    Alert.alert(
      'Alert Title',
      msg
    );
    return;
  },
  render: function() {
    var cateId = this.state.cateId;
    var userType = 1;
    var tabLink = 'http://list.tmall.com/search_product.htm?abbucket=&acm=lb-tms-1261802-40482.1003.8.316504&aldid=316504&q=%CA%D6%BB%FA&spm=a220m.1000858.a2227oh.d100&from=.list.pc_1_searchbutton&abtest=&type=p&scm=1003.8.lb-tms-1261802-40482.ITEM_1436707130731_316504&pos=1';
    var tabDataSource = [
      {code: 0, name: '我的方案'},
      {code: 1, name: '乐夺宝', link: tabLink,icon: ''}
    ];
    return (
      <View style={css.flex}>
        <View style={[css.header, css.row]}>
          <TouchableOpacity style={css.left} onPress={this._pop.bind(this, '管理')}>
            <Text style={css.fontFFF}>管理</Text>
          </TouchableOpacity>

          <View style={css.header,css.amount}>
            <View style={css.center}>
              <Text style={css.amountFontText,css.fontBold}>合计:9828</Text>
            </View>
            <View style={css.center}>
              <Text style={css.amountFontText}>方案:715 乐夺宝:9113</Text>
            </View>
          </View>

          <View style={{backgroundColor: '#fefefe',top:22, width: 1, height: 48, right: 0}}/>

          <TouchableOpacity style={css.right} onPress={this._pop.bind(this, '结算')}>
            <Text style={css.fontFFF}>结算</Text>
          </TouchableOpacity>
        </View>

        {/*用户区分是否展示tab*/}
        {
          userType===1 ?
          <Tabs updateCateItem={(cateId)=>this.setState({cateId : cateId})}
              initData={{tabDataSource}}/>
          : <View></View>
        }

        {/*产品列表*/}
        <ItemList cateId={cateId} onSelect={(item)=>this.selectItem(item)}/>

      </View>
    );
  },
  //选中一行
	selectItem:function(item){
    //console.log(item);
		if (Platform.OS === 'ios') {
			this.props.navigator.push({
				title:item.txt,
				component:ItemDetail,
        navigationBarHidden:false,
        index:3,
				passProps:{item:item},
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
  row: {
    flexDirection: 'row'
  },
  header: {
    height: 76,
    backgroundColor: Util.headerColor
  },
  fontFFF: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold'
  },
  left: {
    justifyContent: 'center',
    left: 16,
    marginBottom: -16
  },
  right: {
    justifyContent: 'center',
    right: -16,
    marginBottom: -16
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  amount: {
    justifyContent: 'center',
    marginBottom: -16,
    alignItems:'flex-end',
    width:Util.size['width']-100,
    right:6
  },
  amountFontText: {
    color: '#fff',
    fontSize:12
  },
  fontBold: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
