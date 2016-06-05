'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  View,
  StyleSheet,
  Text,
  Platform,
  ScrollView,
} = ReactNative;

var createExamplePage = function(title: ?string, exampleModule: ExampleModule)
  : ReactClass<any> {
  var ExamplePage = React.createClass({
    statics: {
      title: exampleModule.title,
      description: exampleModule.description,
    },

    getBlock: function(example: Example, i) {
      var {title, description, platform} = example;
      if (platform) {
        if (Platform.OS !== platform) {
          return null;
        }
        title += ' (' + platform + ' only)';
      }
      // Hack warning: This is a hack because the www UI explorer used to
      // require render to be called. It should just return elements now.
      var originalRender = React.render;
      var originalIOSRender = ReactNative.render;
      var renderedComponent;
      // TODO remove typecasts when Flow bug #6560135 is fixed
      // and workaround is removed from react-native.js
      (React: Object).render =
      (ReactNative: Object).render =
        function(element, container) {
          renderedComponent = element;
        };
      var result = example.render(null);
      if (result) {
        renderedComponent = React.cloneElement(result, {
          navigator: this.props.navigator,
        });
      }
      (React: Object).render = originalRender;
      (ReactNative: Object).render = originalIOSRender;
      var description;
      if (description) {
        description =
          <Text style={styles.descriptionText}>
            {description}
          </Text>;
      }
      return (
        <View style={styles.container} key={i}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              {title}
            </Text>
            {description}
          </View>
          <View style={styles.children}>
            {renderedComponent}
          </View>
        </View>
      );
    },

    render: function() {
      var ContentWrapper;
      var wrapperProps = {};
      if (this.props.noScroll) {
        ContentWrapper = (View: ReactClass<any>);
      } else {
        ContentWrapper = (ScrollView: ReactClass<any>);
        wrapperProps.automaticallyAdjustContentInsets = !this.props.title;
        wrapperProps.keyboardShouldPersistTaps = true;
        wrapperProps.keyboardDismissMode = 'interactive';
      }
      var title = this.props.title
      ?
      <View style={styles.title}>
        <Text style={styles.text}>
          {this.props.title}
        </Text>
      </View>
      :
      null;
      var spacer = this.props.noSpacer ? null : <View style={styles.spacer} />;
      return (
        <View style={styles.page}>
          {title}
          <ContentWrapper
            style={styles.wrapper}
            {...wrapperProps}>
              {exampleModule.examples.map(this.getBlock)}
              {spacer}
          </ContentWrapper>
        </View>
      );
    }
  });

  return ExamplePage;
};

var styles = StyleSheet.create({
  container: {
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#ffffff',
    margin: 2,
    marginVertical: 5,
    overflow: 'hidden',
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 2.5,
    borderBottomColor: '#d6d7da',
    backgroundColor: '#f6f7f8',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
  },
  children: {
    margin: 10,
  },
  page: {
    backgroundColor: '#e9eaed',
    flex: 1,
  },
  spacer: {
    height: 270,
  },
  wrapper: {
    flex: 1,
    paddingTop: 10,
  },
  title: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    margin: 10,
    marginBottom: 0,
    height: 45,
    padding: 10,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 19,
    fontWeight: '500',
  },
});

module.exports = createExamplePage;
