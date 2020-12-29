const api=require("../../../config/api");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    problem:[],
    currentPage:1,//当前页
    limit:3,//当前页面总条数
    pages:0,//总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //调用该function
    this.getHelp();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //查询常用问题请求
  getHelp:function(){
    let currentPage=this.data.currentPage;
    let limit=this.data.limit;
    let that=this;
    wx.request({
      url:api.IssueList,
      data:{"currentPage":currentPage,"limit":limit},
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded"},
      dataType:"json",
      success:function(result){
        that.setData({problem:result.data.data.list})//设置查询到的问题和答案
        that.setData({pages:result.data.data.pages})//设置总页数
      }
    })
  },
  //上一页
  prePage:function(){
    if(this.data.currentPage>=this.data.pages){
      this.data.currentPage=this.data.currentPage-1
      this.getHelp();
    }
  },
  //下一页
  nextPage:function(){
    if(this.data.pages>=this.data.currentPage){
      this.data.currentPage=this.data.currentPage+1
      this.getHelp();
    }
  }

})