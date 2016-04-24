/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  ScrollView,
  Platform,
  SliderIOS,
  TouchableWithoutFeedback,
  PixelRatio,
  View,
  Text
} = React;

var Animatable = require('react-native-animatable');

if(!StyleSheet.flatten) {
  StyleSheet.flatten = require('flattenStyle');
}

var Example = React.createClass({
    render: function() {
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => this.refs.view.bounce(1800)}>
          <Animatable.View ref="view">
            <Text>Bounce me!</Text>
          </Animatable.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent:'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginTop: (Platform.OS === 'ios' ? 40 : 20),
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20,
  },
  slider: {
    height: 30,
    margin: 10,
  },
  toggle: {
    width: 120,
    backgroundColor: '#333',
    borderRadius: 3,
    padding: 5,
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'center',
    margin: 10,
    color: 'rgba(255, 255, 255, 1)',
  },
  toggledOn: {
    color: 'rgba(255, 33, 33, 1)',
    fontSize: 16,
    transform: [{
      rotate: '8deg'
    }, {
      translateY: -20
    }]
  },
  sectionHeader: {
    borderTopWidth: 1 / PixelRatio.get(),
    borderColor: '#ccc',
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  sectionHeaderText: {
    textAlign: 'center',
    fontSize: 16,
  },
  animatableName: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  animatable: {
    padding: 20,
    margin: 10,
  }
});

module.exports = Example;
