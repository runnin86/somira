const URL_COMMON = 'http://api.zqsml.com/api/v1/sml/'
// const URL_COMMON = 'http://123.57.217.199:9587/api/v1/sml/'

// 方案接口地址
export let planApi = {
  // banner地址
  banner: URL_COMMON + 'slider?type=tc',
  // 获取首页方案
  plan: URL_COMMON + 'plan',
  // 方案详情
  detail: URL_COMMON + 'planbyid',
  // 添加购物车
  addCart: URL_COMMON + 'addspcart',
  // 删除购物车
  delCart: URL_COMMON + 'delspcarmtp',
  // 更新购物车
  upCart: URL_COMMON + 'upspcart',
  // 查询购物车(redis)
  queryCart: URL_COMMON + 'quespcart',
  // 购物车支付
  cartPay: URL_COMMON + 'balspcart',
  // 详情页支付
  buyPlan: URL_COMMON + 'buyplan',
  // 盈利排行
  rank: URL_COMMON + 'ranktop',
  // 周盈利排行
  rankweek: URL_COMMON + 'rankweek',
  // 我的订单方案
  myplan: URL_COMMON + 'planinfo',
  // 打赏
  doreward: URL_COMMON + 'doreward',
  // 服务器时间
  time: URL_COMMON + 'nowtime'
}

// 乐夺宝接口地址
export let hpApi = {
  // banner地址
  banner: URL_COMMON + 'slider?type=1yg',
  // 获取首页商品
  home: URL_COMMON + 'oneBuyProject',
  // 中奖信息
  winner_info: URL_COMMON + 'oneBuyCycle',
  // 个人参与记录
  my_partake: URL_COMMON + 'oneBuyUserPay',
  // 所有参与记录
  all_partake: URL_COMMON + 'oneBuyUser',
  // 所有参与记录
  userOneBuyOrder: URL_COMMON + 'userOneBuyOrder',
  // 中奖记录
  oneBuyNewPublic: URL_COMMON + 'oneBuyNewPublic',
  // 添加到购物车-post,查询购物车-get,删除购物车-delete,更新购物车-put.(redis)
  redisCart: URL_COMMON + 'shoppingCart',
  // 购物车支付
  cartPay: URL_COMMON + 'shoppingCartPay',
  // 详情页支付
  ptpay: URL_COMMON + 'ptpay'
}

// 用户公用接口地址
export let userApi = {
  // 登录
  login: URL_COMMON + 'login',
  // 修改用户密码
  changePwd: URL_COMMON + 'modifypwd',
  // 我的本金
  coinmeter: URL_COMMON + 'coinmeter',
  // 我的盈利
  useRate: URL_COMMON + 'userate',
  // 我的销量
  userSales: URL_COMMON + 'nowmflow',
  // 我的销量(上月)
  lastSales: URL_COMMON + 'lastmflow',
  // 我的消息
  userMessage: URL_COMMON + 'usermsg',
  // 我的消息(删除)
  delMessage: URL_COMMON + 'delmsgbyid',
  // 我的二维码
  qrcode: URL_COMMON + 'qrcode',
  // 我的团队
  team: URL_COMMON + 'team',
  // 我的返佣
  commission: URL_COMMON + 'commissionlist',
  // 我的账单方案记录
  myplan: URL_COMMON + 'myplan',
  // 我的账单充值
  myrecharge: URL_COMMON + 'myrecharge',
  // 我的账单提现
  mywithdraw: URL_COMMON + 'mywithdraw',
  // 我的账单打赏
  myreward: URL_COMMON + 'reward',
  // wtype  1：盈利提现 2:返佣提现
  withdraw: URL_COMMON + 'withdraw'
}
