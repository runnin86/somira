var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View
} = React;

module.exports = React.createClass({
  componentDidMount(){
    //console.log(this.props.item);
    // this.setState({
    //   item: this.props.item
    // });
  },
  render: function() {
    return (
      <View style={css.container}>
        <Text style={css.welcome}>
          Welcome to {this.props.item.explain}!
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
