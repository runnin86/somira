var React = require('react-native');
var NormalUserCenter = require('./UserCenter-hp');
var ItemDetail = require('../../Component/ShoppingCart/ItemDetail');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform
} = React;

module.exports = React.createClass({
  render: function() {
    var userType = 1;
    return (
      <View>
      {
        userType===1 ?
        <NormalUserCenter onSelect={(item)=>this.selectItem(item)}/>
        : <View style={css.container}>
            <Text style={css.welcome}>
              Welcome to userCenter!
            </Text>
            <Text style={css.instructions}>
              To get started, edit index.ios.js
            </Text>
            <Text style={css.instructions}>
              Press Cmd+R to reload,{'\n'}
              Cmd+D or shake for dev menu2
            </Text>
          </View>
      }
      </View>
    );
  },
  //选中一行
  selectItem:function(item){
    //console.log(item);
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title:'个人中心商品详细',
        component:ItemDetail,
        navigationBarHidden:false,
        passProps:{item},
      });
    }else{
      //android对应的处理
    }
  },
});

var css = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
