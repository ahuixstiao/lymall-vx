var api = require('../../config/api');

var app = getApp();

Page({
  data: {
    couponList: [],
    code: '',
    status: 0,
    page: 1,
    limit: 10,
    count: 0,
    scrollTop: 0,
    showPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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

  getCouponList: function() {

    let that = this;
    that.setData({
      scrollTop: 0,
      showPage: false,
      couponList: []
    });
    // util.request(api.CouponMyList, {
    //   status: that.data.status,
    //   page: that.data.page,
    //   limit: that.data.limit
    // }).then(function(res) {
    //   if (res.errno === 0) {

    //     that.setData({
    //       scrollTop: 0,
    //       couponList: res.data.list,
    //       showPage: res.data.total > that.data.limit,
    //       count: res.data.total
    //     });
    //   }
    // });

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
  goExchange: function() {
    if (this.data.code.length === 0) {
      util.showErrorToast("请输入兑换码");
      return;
    }

    let that = this;
    // util.request(api.CouponExchange, {
    //   code: that.data.code
    // }, 'POST').then(function (res) {
    //   if (res.errno === 0) {
    //     that.getCouponList();
    //     that.clearExchange();
    //     wx.showToast({
    //       title: "领取成功",
    //       duration: 2000
    //     })
    //   }
    //   else{
    //     util.showErrorToast(res.errmsg);
    //   }
    // });
  },
  nextPage: function(event) {
    var that = this;
    if (this.data.page > that.data.count / that.data.limit) {
      return true;
    }

    that.setData({
      page: that.data.page + 1
    });

    this.getCouponList();

  },
  prevPage: function(event) {
    if (this.data.page <= 1) {
      return false;
    }

    var that = this;
    that.setData({
      page: that.data.page - 1
    });
    this.getCouponList();
  },
  switchTab: function(e) {

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