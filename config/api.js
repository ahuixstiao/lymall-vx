var WxApiRoot="http://localhost:8080/wx/"

module.exports={
  AuthLoginByAccount: WxApiRoot+"auth/login",//账户登录
  AuthRegister: WxApiRoot+"auth/register",//账户注册
  verification: WxApiRoot+"verification",
  IssueList: WxApiRoot+"issue/list",//查询常见问题
  AuthReset: WxApiRoot+"auth/reset",
  AddressList: WxApiRoot+"address/list",//根据用户id查询收货地址
  AddressDelete: WxApiRoot+"address/delete",//根据地址id来删除收货地址
  AddressSave: WxApiRoot+"address/save",//添加收货地址
  IndexUrl:WxApiRoot+"home/index",//首页信息查询
  SearchIndex:WxApiRoot+"search/index",//搜索关键字
  SearchResult:WxApiRoot+"search/result",//搜索结果
  SearchHelper:WxApiRoot+"search/helper",//搜索帮助
  SearchCreateHistory:WxApiRoot+"search/createhistory",//搜索历史添加
  SearchClearHistory:WxApiRoot+"search/clearhistory", //搜索历史清除
  SelectByGoodsIdFindGoods:WxApiRoot+"select/goods",//查询商品信息
  SelectByPopularProduct:WxApiRoot+"select/hotgoodsinfo",//查询热门商品信息
  BrandDetail:WxApiRoot+"brand/detail",//查询单个品牌商详情
  BrandList:WxApiRoot+"brand/list",//查询全部品牌商信息
  BrandFindGoodsList:WxApiRoot+"brand/goodslist",//查询品牌商下的商品
  CatalogList:WxApiRoot+"catalog/index",//查询分类目录
  CatalogCurrentCategory:WxApiRoot+"catalog/currentCategory",//查询选中的父分类的子分类信息
  CatagoryGoodsInfo:WxApiRoot+"catalog/currentCategoryGoodsList",//查询当前分类的商品信息
  GetCoupon:WxApiRoot+"coupon/getCoupon",//领取优惠券
  SelectUserCouponInfo:WxApiRoot+"coupon/selectUserCoupon",//查询用户所有优惠券信息
  PromoCodGetCoupon:WxApiRoot+"coupon/promoCodGetCoupon",//通过优惠码兑换优惠券
}