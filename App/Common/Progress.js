'use strict';
/*
 * color=purple,red,orange,yellow
 */
var React = require('react-native');
var {
  ProgressViewIOS,
  StyleSheet,
  View,
} = React;

module.exports = React.createClass({
  getInitialState() {
    return {
      progress: this.props.progress,
    };
  },
  componentDidMount() {
    //this.updateProgress();
  },
  //render 之前调用
  //之所以取nextProps的值而不直接取this.props.cateId 是因为componentWillReceiveProps的更新早于props的更新
  componentWillReceiveProps(nextProps) {
    this.setState({
        progress : nextProps.progress,
        color: nextProps.color
    })
  },
  render() {
    return (
      <View style={styles.container}>
        <ProgressViewIOS style={styles.progressView} progressTintColor={this.state.color} progress={this.state.progress}/>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    marginTop: -20,
    backgroundColor: 'transparent',
  },
  progressView: {
    marginTop: 20,
  }
});
