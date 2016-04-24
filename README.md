# ReactNativeSomira1
ReactNative iOS APP for somira

# 使用main.jsbundle
1.在React Native项目根目录下运行 npm start

2.使用curl命令生成 main.jsbundle

curl http://localhost:8081/index.ios.bundle -o main.jsbundle

3.在AppDelegate.m中选择使用main.jsbundle注释掉

jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];

取消注释下面这一行

// jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
