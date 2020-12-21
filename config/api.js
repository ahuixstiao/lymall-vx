var WxApiRoot="http://localhost:8080/wx/"

module.exports={
  AuthLoginByAccount: WxApiRoot+"auth/login",//账户登录
  AuthRegister: WxApiRoot+"auth/register",//账户注册
  verification: WxApiRoot+"verification",
  IssueList: WxApiRoot+"issue/list",//帮助中心
  AuthReset: WxApiRoot+"auth/reset",
  AddressList: WxApiRoot+"address/list",//根据用户id查询收货地址
  AddressDelete: WxApiRoot+"address/delete",//根据地址id来删除收货地址
  AddressSave: WxApiRoot+"address/save",//添加收货地址
  IndexUrl:WxApiRoot+"home/index",//首页信息查询
  SearchIndex:WxApiRoot+"search/index",//搜索关键字
}