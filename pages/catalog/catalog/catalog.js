var api = require('../../../config/api.js');

Page({
  data: {
    categoryList: [],//所有父分类
    currentCategory: {},//当前父分类
    currentSubCategoryList: [],//当前子类别列表
    scrollLeft: 0, //选中的父分类
    goodsCount: 0,//商品总数
  },

  /**
   * 页面加载
   * @param {*} options 
   */
  onLoad: function(options) {
    
    this.getCatalog();
  },
  
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getCatalog();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 获取分类页面加载时所需要显示的数据
   * 商品总数、父分类、子分类、
   */
  getCatalog: function() {
    //CatalogList
    let that = this;

    wx.showLoading({
      title: '加载中...',
    });
    //发送请求获取页面加载所需要的数据
    wx.request({
      url: api.CatalogList,
      dataType:"json",
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded"},
      success:function(result){
        if(result.data.errno==0){
          that.setData({
            goodsCount:result.data.data.goodsCount,//商品总数
            categoryList:result.data.data.categoryList,//所有商品父分类信息
            currentCategory:result.data.data.currentCategory,//获取当前选中的父分类对象
            currentSubCategoryList:result.data.data.currentSubCategoryList,//获取当前父分类的子分类信息
          });
        }
        wx.hideLoading();
      }
    });

  },

  //获取当前父分类的子分类等信息
  getCurrentCategory: function(id) {
    let that = this;
    
    //发送请求
    wx.request({
      url: api.CatalogCurrentCategory,
      data:{"categoryPid":id},
      dataType:"json",
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded"},
      success:function(result){
        if(result.data.errno==0){
          that.setData({
            //从父分类集合中获取父分类对象 按照用户选中的index来获取
            currentCategory:that.data.categoryList[that.data.scrollLeft],
            //保存后台返回的子分类集合
            currentSubCategoryList:result.data.data,
          });
        }
      }
    })
  },

  /**
   * 选中的父分类
   * @param {*} event 
   */
  switchCate: function(event) {
    var that = this;
    //保存 选中的父分类Id与index下标
    var currentTarget = event.currentTarget.dataset;
    //判断选中的是否是相同的父分类 相同则打断操作
    if (that.data.currentCategory.categoryId == currentTarget.id) {
      return false;
    }
    //将用户选中的父分类下标保存
    that.setData({
      scrollLeft:currentTarget.index,
    });
    //不相同则发送categoryId查询
    that.getCurrentCategory(currentTarget.id);
  }
})