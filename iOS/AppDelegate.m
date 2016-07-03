/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTRootView.h"

#import "RCTPushNotificationManager.h"

#import "XGPush.h"

#import "XGSetting.h"

@implementation AppDelegate

// app在杀死状态时,推送上报触发
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // 腾讯信鸽注册通知
  [XGPush startApp:2200207305 appKey:@"I67Q25W1IUIN"];
  [XGPush handleLaunching:launchOptions];
  
  [self registerNofitication];
  
  // RN开始
  NSURL *jsCodeLocation;

  /**
   在plist里增加一行 UIStatusBarStyle(或者是“Status bar style”也可以)，这里可以设置两个值，就是上面提到那两个
   UIStatusBarStyleDefault 和 UIStatusBarStyleLightContent
   
   这样在app启动的launch页显示的时候，statusBar的样式就是上面plist设置的风格。
   */
  
  /**
   * Loading JavaScript code - uncomment the one you want.
   *
   * OPTION 1
   * Load from development server. Start the server from the repository root:
   *
   * $ npm start
   *
   * To run on device, change `localhost` to the IP address of your computer
   * (you can get this by typing `ifconfig` into the terminal and selecting the
   * `inet` value under `en0:`) and make sure your computer and iOS device are
   * on the same Wi-Fi network.
   */
  
  jsCodeLocation = [NSURL URLWithString:@"http://192.168.1.3:8081/index.ios.bundle"];
  
  /**
   * OPTION 2
   * Load from pre-bundled file on disk. To re-generate the static bundle
   * from the root of your project directory, run
   *
   * $ react-native bundle --minify
   *
   * see http://facebook.github.io/react-native/docs/runningondevice.html
   */

  // jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"somira"
                                                      initialProperties:nil
                                                   launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  NSLog(@"=============程序启动成功=============");
  return YES;
}

// 注册通知
- (void) registerNofitication {
  if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
    [[UIApplication sharedApplication] registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes: (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge) categories:nil]];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
  } else {
    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:(UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound)];
  }
}

// 注册通知设置
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}

// 注册远程通知token
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  
  void (^successBlock)(void) = ^(void){
    // 成功之后的处理
    // NSLog(@"[XGPush Demo]注册远程通知token successBlock");
  };
  
  void (^errorBlock)(void) = ^(void){
    // 失败之后的处理
    // NSLog(@"[XGPush Demo]注册远程通知token errorBlock");
  };
  
  // 设置账号
  [XGPush setAccount:@"56705295"];
  
  // 注册设备
  NSString * deviceTokenStr = [XGPush registerDevice:deviceToken successCallback:successBlock errorCallback:errorBlock];
  
  // 打印获取的deviceToken的字符串
  // NSLog(@"[XGPush Demo] 设备token是 %@",deviceTokenStr);
}


// app在前台和后台运行时,推送上报触发
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  NSLog(@"得到推送消息-> %@", notification);
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
  //推送反馈(app运行时)
  [XGPush handleReceiveNotification: notification];
}

// 收到本地通知
-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification{
  //notification是发送推送时传入的字典信息
  [XGPush localNotificationAtFrontEnd:notification userInfoKey:@"clockID" userInfoValue:@"myid"];
  
  //删除推送列表中的这一条
  [XGPush delLocalNotification:notification];
  [XGPush delLocalNotification:@"clockID" userInfoValue:@"myid"];
  
  //清空推送列表
  [XGPush clearLocalNotifications];
}


//如果deviceToken获取不到会进入此事件
- (void)application:(UIApplication *)app didFailToRegisterForRemoteNotificationsWithError:(NSError *)err {
  
  NSString *str = [NSString stringWithFormat: @"Error: %@",err];
  
  NSLog(@"[deviceToken获取不到会进入此事件]%@",str);
  
}

@end
