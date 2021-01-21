const api = require("../../../config/api");
const app = getApp();
Page({
  data: {
    categoryPid: 0, //查询各大商品分类
    currentPage: 1, //当前页
    limit: 4, //每页显示的条数

    goodsCount: 0, //商品总数
    banner: [], //广告
    channel: [], //商品分类
    coupon: [], //优惠券
    groupons: [], //团购专区
    brands: [], //品牌制造商直供
    newGoods: [], //周一周四 · 新品首发 
    hotGoods: [], //人气推荐
    topics: [], //专题精选
    floorGoods: [], //更多好物
  },
  onLoad: function () {
    let categoryPid = this.data.categoryPid;
    let currentPage = this.data.currentPage;
    let limit = this.data.limit;
    var that = this;
    //页面加载时 向后端发送请求
    wx.request({
      url: api.IndexUrl,
      data: {
        "categoryPid": categoryPid,
        "currentPage": currentPage,
        "limit": limit
      },
      dataType: "json",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (result) {
        if (result.data.errno == 0) {
          that.setData({
            goodsCount: result.data.data.goodsCount, //商品总数
            banner: result.data.data.banner, //广告
            channel: result.data.data.channel, //商品分类
            coupon: result.data.data.coupon.data.list, //优惠券
            groupons: result.data.data.groupons.data.list, //团购专区
            brands: result.data.data.brands.data.list, //品牌制造商直供
            newGoods: result.data.data.newGoods.data.list, //新品首发商品信息
            hotGoods: result.data.data.hotGoods.data.list, //人气推荐商品信息
            topics: result.data.data.topics.data.list, //专题精选
            floorGoods: result.data.data.floorGoods, //更多好物
          });
        }
      }
    })
  },

  /**
   * 领取优惠券
   * @param {获取用户选中的优惠券下标获取优惠券信息} event 
   */
  getCoupon: function (event) {
    let that = this;
    //获取优惠券id
    let coupon=event.currentTarget.dataset.index;
    //判断用户是否已登陆 未登陆则跳到选择登陆页面
    if (app.globalData.hasLogin) {
      //判断该优惠券是否需要兑换
      if (coupon.couponTag == "仅兑换领券") {
        wx.showModal({
          content: "该优惠券需要兑换",
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/coreservices/couponList/couponList',
              });
            }
          }
        })
        return;
      }
      //发送领取优惠券请求
      wx.request({
        url: api.GetCoupon,
        data: {
          "couponId": parseInt(coupon.couponId),
          "userId": parseInt(app.globalData.userInfo.userId),
          "status": 0
        },
        dataType: "json",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (result) {
          //判断是否领取成功 部分优惠券只可领取一次 领取成功则跳到优惠券页面并查询
          if (result.data.errno=== 0) {
            wx.reLaunch({
              url: '/pages/coreservices/couponList/couponList',
            })
          }
          else if(result.data.errorNum===1){
            wx.showModal({
              content:"您已领取该优惠券请先使用！",
              showCancel:false,
            })
          }
        }
      })
    }

  },

})