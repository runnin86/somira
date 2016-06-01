var React = require('react-native');

var Util = require('../../Common/Util');
var Button = require('react-native-button');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform
} = React;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      cateId : 1,
      tabData: [
        {
          code: 0,
          name: '所有参与'
        },{
          code: 1,
          name: '历史记录',
          link: 'http://list.tmall.com/search_product.htm?abbucket=&acm=lb-tms-1261802-40482.1003.8.316504&aldid=316504&q=%CA%D6%BB%FA&spm=a220m.1000858.a2227oh.d100&from=.list.pc_1_searchbutton&abtest=&type=p&scm=1003.8.lb-tms-1261802-40482.ITEM_1436707130731_316504&pos=1',
          icon: ''
        }
      ]
    };
  },
  _pop: function(msg){
    Alert.alert(
      'Alert Title',
      msg
    );
    return;
  },
  _handlePress(event) {
    alert(event.type);
  },
  render: function() {
    var cateId = this.state.cateId;
    var tabDataSource = this.state.tabData;
    var userType = 1;
    return (
      <View style={css.flex}>
        <View style={[css.header]}>
          <View style={css.flexRow}>
            <View style={css.cellfixed}>
              <Image style={css.userPhoto}
                source={require('image!默认头像')}/>
            </View>
            <View style={css.userDetail}>
              <Text style={css.userDesc} numberOfLines={2}>我有一只小海豚</Text>
              <Text style={css.userDesc,css.smallFont} numberOfLines={1}>余额:126666.00</Text>
            </View>
            <View style={css.cellfixed}>
              <View style={css.flexRow}>
                <Button onPress={(type)=>this._handlePress({type:'消息'})}>
                  <Image style={css.btnPhotoMsg}
                    source={require('image!消息按钮')}/>
                </Button>
                <Button onPress={(type)=>this._handlePress({type:'设置'})}>
                  <Image style={css.btnPhotoSet}
                    source={require('image!设置按钮')}/>
                </Button>
              </View>
            </View>
          </View>
          <View style={css.center}>
            <Button containerStyle={css.rechargeBtn}
              onPress={(type)=>this._handlePress({type:'充值'})}>
              <Text style={css.rechargeBtnFont}>充值</Text>
            </Button>
          </View>
        </View>

      </View>
    );
  },
});

var css = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    height: Util.size['height']*0.26,
    backgroundColor: Util.headerColor,
    paddingTop: Util.size['height']*0.06
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  rechargeBtn:{
    marginTop: 10,
    //padding:30,
    width:Util.size['width']*0.76,
    height:25,
    overflow:'hidden',
    borderRadius:4,
    backgroundColor: 'white'
  },
  rechargeBtnFont: {
    textAlign: 'center',
    marginTop: 4,
    color:'red'
  },
  flexRow: {
    // 容器需要添加direction才能变成让子元素flex
    flexDirection: 'row'
  },
  cellfixed: {
    height: Util.size['height']*0.12,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  userDesc : {
    height : 18,
    color : '#FFFFFF',
    textAlign: 'left',
    marginRight: 2,
    fontWeight: 'bold'
  },
  userDetail:{
    flex : 1,
    flexDirection : 'column',
    height: Util.size['height']*0.12,
    justifyContent: 'center',
    paddingTop:10
  },
  smallFont: {
    fontWeight : '100',
    fontSize : 12,
    color : '#FFFFFF'
  },
  userPhoto: {
    width:50,
    height:50
  },
  btnPhotoMsg: {
    width:24,
    height:17,
    right: 6,
    borderRadius:4,
    top: 2
  },
  btnPhotoSet: {
    width:22,
    height:22,
    left: 6
  }
});
