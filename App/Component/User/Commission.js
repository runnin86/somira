import React from 'react-native';

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PropTypes
} = React;

module.exports = React.createClass({
  /*
   * 获取实例初始状态(state，来自props)
   */
  getInitialState: function () {
    return {
      on: this.props.on,
      name: this.props.name
    }
  },
  /*
   * 渲染(JSX,通过state控制DOM结构变化)
   */
  render: function() {
    return (
      <View style={css.container}>
        <Text style={css.welcome}>
          Welcome to 返佣!
        </Text>
        <Text style={css.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={css.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu2
        </Text>
      </View>
    );
  }
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
