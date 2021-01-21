var api = require('../../../config/api');
var app = getApp();

Page({
  data: {
    couponList: [], //查询到的优惠券数组
    code: '', //优惠码
    status: 0, //优惠券状态

    currentPage: 1,
    limit: 10,
    count: 0, //优惠券总数
    scrollTop: 0,
    showPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCouponList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getCouponList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  //获取优惠券信息
  getCouponList: function () {
    let that = this;
    let userId = app.globalData.hasLogin?app.globalData.userInfo.userId:""
    that.setData({
      scrollTop: 0,
      showPage: false,
      couponList: []
    });
    wx.request({
      url: api.SelectUserCouponInfo,
      data: {
        "userId": parseInt(userId),
        "status": that.data.status,
        "currentPage": that.data.currentPage,
        "limit": that.data.limit
      },
      dataType:"json",
      method:"POST",
      header:{"content-type": "application/x-www-form-urlencoded"},
      success:function(result){
        if (result.data.errno === 0) {
          that.setData({
            scrollTop: 0,
            couponList: result.data.data.list,
            showPage: result.data.data.total > that.data.limit,
            count: result.data.data.total
          });
        }
      }
    });
  },
  bindExchange: function (e) {
    this.setData({
      code: e.detail.value
    });
  },
  clearExchange: function () {
    this.setData({
      code: ''
    });
  },
  //兑换优惠券
  goExchange: function () {
    if (this.data.code.length === 0) {
      util.showErrorToast("请输入兑换码");
      return;
    }

    let that = this;
    let userId=app.globalData.hasLogin?app.globalData.userInfo.userId:"";
    //发送请求兑换优惠券
    wx.request({
      url: api.PromoCodGetCoupon,
      data:{"code":that.data.code,"userId":userId},
      dataType:"json",
      method:"POST",
      header:{"content-type": "application/x-www-form-urlencoded"},
      success:function(result){
        console.log(result);
        if (result.data.errno === 0) {
          that.getCouponList();
          that.clearExchange();
          wx.showToast({
            title: "领取成功",
            duration: 2000
          })
        }
        else{
          wx.showToast({
            title: result.data.errorMessage,
            duration: 2000
          })
        }
      }
    })
  },

  nextPage: function (event) {
    var that = this;
    if (this.data.page > that.data.count / that.data.limit) {
      return true;
    }

    that.setData({
      page: that.data.page + 1
    });

    this.getCouponList();

  },
  prevPage: function (event) {
    if (this.data.page <= 1) {
      return false;
    }

    var that = this;
    that.setData({
      page: that.data.page - 1
    });
    this.getCouponList();
  },
  switchTab: function (e) {

    this.setData({
      couponList: [],
      status: e.currentTarget.dataset.index,
      page: 1,
      limit: 10,
      count: 0,
      scrollTop: 0,
      showPage: false
    });

    this.getCouponList();
  },
})