//单个商品坑位
//doc组件生命周期： http://reactjs.cn/react/docs/working-with-the-browser.html#component-lifecycle

'use strict';

var React = require('react-native');
var Util = require('../../Common/Util');
var Progress = require('../../Common/Progress');
var Button = require('react-native-button');

var {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} = React;

var { Image } = require('react-native-animatable');

module.exports = React.createClass({
  _animatables: {},
  _pushCart: function(event,id){
    this._animatables[id]['slideInLeft'](1000);
  },
	render() {
		let item = this.props.item;
    let progressNum = (parseFloat(item.totalCount) - parseFloat(item.codeCount)) / parseFloat(item.totalCount);
    let img = item.images.split(',')[0];
		return (
			<TouchableOpacity onPress={this.props.onSelect}>
				<View style={css.container}>
          <Image ref={component => this._animatables[item.id] = component} style={css.goodImg} source={{uri : img}} />
					<View style={css.goodInfo}>
						<Text style={css.goodTit,{fontSize : 14}} numberOfLines={2}>{item.name}</Text>
            <Text style={css.goodTit,{fontWeight : '100',fontSize : 10,marginTop : 4}} numberOfLines={1}>{item.content}</Text>
            {/*
            <View style={css.goodRow}>
							<Text style={css.redPrice}><Text style={css.yen}>&yen;</Text> {item.orderprice || item.codeCount}</Text>
							<Text style={css.whitePrice}>&yen;{item.totalCount}</Text>
						</View>
            */}
            <View style={css.progress}>
              <Progress progress={progressNum}/>
						</View>
            <View style={css.goodRow}>
              <View>
                <Text style={css.redPrice}>
                  {item.totalCount}
                </Text>
                <Text style={css.goodTit,{fontWeight:'100',fontSize:10}}>总需</Text>
              </View>
              <View>
                <Text style={css.whitePrice}>
                  {item.codeCount}
                </Text>
                <Text style={css.goodTit,{fontWeight:'100',fontSize:10}}>剩余</Text>
              </View>
              <View style={css.goodBtnWarp}>
                <Button onPress={(name)=>this._pushCart(this,item.id)}>
                  <Image style={css.goodBtnImg} source={{uri: 'icon_addcar_big_black'}}/>
                </Button>
              </View>
            </View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
});

// 组件样式
var css = StyleSheet.create({
  container: {
  	flex : 1,
    paddingTop: 10,
    paddingBottom: 2,
    flexDirection: 'row',
    borderBottomColor : '#eeeeee',
    borderBottomWidth : 1,
    backgroundColor: '#ffffff',
  },
  //左侧商品图
  goodImg : {
  	width : 60,
  	height : 60,
  	marginRight: 15,
    left: 10
  },
  //右侧商品信息
  goodInfo : {
  	flex : 1,
  	flexDirection : 'column'
  },
  goodTit : {
  	// height : 16,
  	color : '#000000',
    textAlign: 'left',
    // marginRight: 2,
  },
  // 价格
  goodRow : {
  	flexDirection : 'row',
  	alignItems: 'center',
  	marginBottom : 10
  },
  redPrice : {
  	color : '#c40001',
    width: (Util.size['width']-70)/2
  },
  whitePrice : {
  	fontSize : 12,
  	color : '#b0b0b0'
  },
  // 购买及按钮
  goodExtra : {
  	flexDirection :'row',
  	alignItems: 'center',
  	justifyContent : 'space-between'
  },
  goodSold : {
  	color : '#b0b0b0'
  },
  goodBtnWarp : {
  	position : 'absolute',
  	right : 20,
  	top : -4
  },
  goodBtnImg: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  progress: {
    width: (Util.size['width']-158),
    marginTop: 5,
    marginBottom: 5
  }
});
