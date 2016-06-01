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
    };
  },
  _handlePress(event) {
    alert(event.type);
  },
  render: function() {
    return (
      <View style={css.flex}>
        <Image style={[css.headerImg]} source={{uri: '个人中心背景'}}>
          <View style={css.cellfixed,css.rightBtn}>
            <Button onPress={(type)=>this._handlePress({type:'消息'})}>
              <Image style={css.btnPhotoMsg}
                source={require('image!消息按钮')}/>
            </Button>
            <Button onPress={(type)=>this._handlePress({type:'设置'})}>
              <Image style={css.btnPhotoSet}
                source={require('image!设置按钮')}/>
            </Button>
          </View>
          <View style={css.cellfixed}>
            <Image style={css.userPhoto}
              source={require('image!默认头像')}/>
          </View>
          <View style={css.cellfixed}>
            <Text style={css.transparentFont}>我有一只穿山甲</Text>
          </View>
          <View style={css.centerBtn}>
            <Button containerStyle={css.withdrawBtn}
              onPress={(type)=>this._handlePress({type:'提现'})}>
              <Text style={css.transparentFont}>提现</Text>
            </Button>
            <Button containerStyle={css.rechargeBtn}
              onPress={(type)=>this._handlePress({type:'充值'})}>
              <Text style={css.rechargeBtnFont}>充值</Text>
            </Button>
          </View>
        </Image>

        <View style={css.moneyRow}>
          <View style={css.moneyCellFixed}>
            <Image style={{width:22,height:24,alignSelf:'center'}} source={require('image!我的本金')} />
            <Text style={css.money}>
              本金 1000
            </Text>
          </View>
  				<View style={css.moneyCell}>
            <Image style={{width:22.5,height:24,alignSelf:'center'}} source={require('image!我的盈利')} />
            <Text style={css.money}>
              盈利 132133.33
            </Text>
  				</View>
          <View style={css.moneyCellFixed}>
            <Image style={{width:60,height:24,alignSelf:'center'}} source={require('image!本月')} />
            <Text style={css.money}>
              销量 500003292
            </Text>
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
  headerImg: {
    height: Util.size['height']*0.3,
    paddingTop: Util.size['height']*0.06,
    resizeMode: Image.resizeMode.cover,
  },
  withdrawBtn: {
    marginTop: 10,
    marginRight:5,
    width:Util.size['width']*0.46,
    height:25,
    overflow:'hidden',
    borderWidth:1,
    borderColor:'#ffffff',
    borderRadius:4,
  },
  transparentFont: {
    textAlign: 'center',
    marginTop: 4,
    color:'#ffffff',
    backgroundColor:'rgba(0,152,50,0)',
  },
  rechargeBtn:{
    marginTop: 10,
    marginLeft:5,
    width:Util.size['width']*0.46,
    height:25,
    overflow:'hidden',
    borderRadius:4,
    backgroundColor: 'white',
  },
  rechargeBtnFont: {
    textAlign: 'center',
    marginTop: 4,
    color:'red'
  },
  cellfixed: {
    width: Util.size['width'],
    justifyContent: 'center',
  },
  centerBtn: {
    flexDirection: 'row',
    alignSelf:'center',
  },
  rightBtn: {
    flexDirection: 'row',
    alignSelf:'flex-end',
    marginRight:20,
  },
  userPhoto: {
    width:50,
    height:50,
    alignSelf:'center',
    marginBottom:6,
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
  },
  moneyRow : {
    flexDirection : 'row',
    backgroundColor: '#3c3d42',
  },
  moneyCell: {
    flex:1,
    width:Util.size['width']*.36,
    height: 46,
    alignItems:'center',
    justifyContent : 'center'
  },
  moneyCellFixed: {
    width:Util.size['width']*.24,
    height: 46,
    justifyContent : 'center'
  },
  money: {
    textAlign: 'center',
    fontSize : 8,
    color: '#FFFFFF',
    marginTop:4,
  },
});
