# ReactNativeSomira
ReactNative iOS APP for somira

# 使用main.jsbundle
1.在React Native项目根目录下运行 npm start(react-native run-ios --reset--cache)

2.使用curl命令生成 main.jsbundle

curl http://localhost:8081/index.ios.bundle -o main.jsbundle

3.在AppDelegate.m中选择使用main.jsbundle注释掉

jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];

取消注释下面这一行

// jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

# 如何隐藏TabBarIOS
文件： RCTWrapperViewController.m
方法： - (void)viewWillAppear:(BOOL)animated
插入语句：
self.navigationController.tabBarController.tabBar.hidden=self.navigationController.childViewControllers.count>1?YES:NO;

# pushy操作相关(https://github.com/reactnativecn/react-native-pushy)
1.进入项目根目录下执行: $ pushy login

2.选择应用: $ pushy selectApp --platform ios

3.上传ipa: $ pushy uploadIpa Payload.ipa

4.发布热更新版本: $ pushy bundle --platform ios

  将来使用pushy publish --platform ios <ppkFile>来发布版本

  将来使用pushy update --platform ios 来使得对应包版本的用户更新
  
