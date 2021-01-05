var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    id: 0,
    brand: {},
    goodsList: [],
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      id: parseInt(options.id)
    });
    this.getBrand();
  },

  //查询品牌商详情
  getBrand: function() {
    let that = this;
    wx.request({
      url: api.BrandDetail,
      data:{"brandId":that.data.id},
      dataType:"json",
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded"},
      success:function(result){
        if(result.data.errno==0){
          that.setData({
            brand:result.data.data
          });
          //执行查询品牌商品信息方法
          that.getGoodsList();
        }
      }
    })
  },

  //查询指定的品牌商下的全部商品
  getGoodsList() {
    var that = this;
    wx.request({
      url: api.BrandFindGoodsList,
      data:{"brandId":that.data.id},
      dataType:"json",
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded"},
      success:function(result){
        if(result.data.errno==0){
          that.setData({
            goodsList:result.data.data,
          });
        }
      }
    })
  },
})