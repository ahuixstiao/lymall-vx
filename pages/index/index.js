const api = require("../../config/api");
Page({
  data: {
    categoryPid:0,//查询各大商品分类
    currentPage:1,//当前页
    limit:4,//每页显示的条数

    goodsCount:0,//商品总数
    banner:[],//广告
    channel:[],//商品分类
    coupon:[],//优惠券
    groupons:[],//团购专区
    brands:[],//品牌制造商直供
    newGoods:[],//周一周四 · 新品首发 
    hotGoods:[],//人气推荐
    topics:[],//专题精选
    floorGoods:[],//更多好物
  },
  onLoad: function () {
    let categoryPid=this.data.categoryPid;
    let currentPage=this.data.currentPage;
    let limit=this.data.limit;
    var that=this;
    //页面加载时 向后端发送请求
    wx.request({
      url: api.IndexUrl,
      data: {"categoryPid":categoryPid,"currentPage":currentPage,"limit":limit},
      dataType: "json",
      method: "POST",
      header: {"content-type":"application/x-www-form-urlencoded"},
      success:function(result){
        if(result.data.errno==0){
          that.setData({
            goodsCount:result.data.data.goodsCount,//商品总数
            banner:result.data.data.banner,//广告
            channel:result.data.data.channel,//商品分类
            coupon:result.data.data.coupon.data.list,//优惠券
            groupons:result.data.data.groupons.data.list,//团购专区
            brands:result.data.data.brands.data.list,//品牌制造商直供
            newGoods:result.data.data.newGoods.data.list,//新品首发商品信息
            hotGoods:result.data.data.hotGoods.data.list,//人气推荐商品信息
            topics:result.data.data.topics.data.list,//专题精选
            floorGoods:result.data.data.floorGoods,//更多好物
          });
          console.log(that.data.floorGoods);
        }
      }
    })
  },
})