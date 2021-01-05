var api = require('../../../config/api.js');
Page({
  data: {
    brandList: [],
    page: 1,
    limit: 10,
    totalPages: 1
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getBrandList();
  },

  /**
   * 查询全部品牌商信息
   */
  getBrandList: function() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    wx.request({
      url: api.BrandList,
      dataType:"json",
      method:"GET",
      success:function(result){
        if(result.data.errno==0){
          that.setData({
            brandList:result.data.data.list,
          });
        }
        //若查询失败则不显示加载提示框
        wx.hideLoading();
      }
    })
  },

  onReachBottom() {
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      });
    } else {
      return false;
    }
    this.getBrandList();
  },
})