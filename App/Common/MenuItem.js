import React from 'react-native';

var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} = React;

module.exports = React.createClass({
  _performClick:function(){
    var onClick = this.props.onClick;
    if(onClick){
      onClick();
    }
  },
  render: function() {
    var height = parseInt(this.props.height);
    var fontSize = parseInt(this.props.fontSize);
    return (
      <TouchableHighlight underlayColor="#dad9d7" onPress={this._performClick}>
        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff',height:height,paddingLeft:20,paddingRight:16}}>
          <Image style={[styles.iconSize]}
            source={{uri: this.props.icon}}/>
          <Text style={{flex:1,color:'#333333',marginLeft:10,fontSize:fontSize,fontWeight:'100',}}>{this.props.title}</Text>
          <Image style={[styles.iconSize]}
            source={require('image!arrow_right_grey')} />
        </View>
      </TouchableHighlight>
    );
  },
});

var styles = StyleSheet.create({
  iconSize: {
    height:20,
    width:20,
    resizeMode: Image.resizeMode.contain,
  }
});
