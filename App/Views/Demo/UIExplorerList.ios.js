'use strict';

export type UIExplorerExample = {
  key: string;
  module: Object;
};

const ComponentExamples: Array<UIExplorerExample> = [
  {
    key: 'TextExample',
    module: require('./TextExample.ios'),
  }
];

const APIExamples: Array<UIExplorerExample> = [
];

const Modules = {};

APIExamples.concat(ComponentExamples).forEach(Example => {
  Modules[Example.key] = Example.module;
});

const UIExplorerList = {
  APIExamples,
  ComponentExamples,
  Modules,
};

module.exports = UIExplorerList;
