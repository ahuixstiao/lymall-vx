//引入api文件的路径
const api = require("../../../config/api");
var app=getApp();
// pages/usercenter/accountLogin/accountLogin.js
Page({

  /**
   * 页面的初始数据
   * 该页面的全局变量，在整个页面可以通过this.data.变量名调用
   */
  data: {
    username:"admin",
    password:"admin",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //绑定用户名和密码，登录后显示用户名，未登录显示点击登录
  /**
   * 账号键盘输入事件
   */
  usernameInput:function (e) {
    var uname=e.detail.value;
    this.setData({username:uname});
  },

  /**
   * 密码键盘输入事件
   */
  passwordInput: function (e) {
    var psw=e.detail.value;
    this.setData({password:psw});
  },

  /**
   * 登录事件 判断账号是否存在
   */
  getAccountLogin: function () {
    //账号
    var username=this.data.username;
    //密码
    var password=this.data.password;
    //判断是否为空
    if(username==="" || password===""){
      wx.showModal({//弹窗显示
        content:"账号或密码不能为空",
        showCancel:false
      })
    }else{
      wx.request({
        url: api.AuthLoginByAccount,//请求地址
        data: {"userUsername":username,"userPassword":password},//请求参数
        //不能设置Referer，content-type默认为application/json
        header:{"content-type":"application/x-www-form-urlencoded"},//请求的header
        method:"POST",//HTTP 请求方法
        dataType:"json",//返回的数据格式
        success:function(result){//成功回调函数
          //判断登录状态 0为成功 1为失败
          if(result.data.errno==0){
            //注意:Storage和StorageSync的写法是不一样
            //获取cookie
            wx.setStorageSync("token",result.cookies[0]);
            //获取用户所有信息
            wx.setStorageSync("userinfo", result.data.data);
            //登录成功时将参数传递到全局配置文件的globalData
            app.globalData.userInfo=result.data.data;
            //登录成功时将登录状态设置为true
            app.globalData.hasLogin=true;
            wx.showModal({
              content:"登录成功",
              showCancel:false,//是否显示取消按钮
              success:function(res){//登录成功后的回调函数
                if(res.confirm){//用户点击确定后跳转至个人中心并显示昵称和头像
                  wx.switchTab({
                    url: '../userindex/userindex',//跳转至个人中心
                  })
                }
              }
            })
          }
          else{
            wx.clearStorage();//清除Storage
            wx.showModal({
              content:result.data.errorMessage,
              showCancel:false//是否显示取消按钮
           })
          }
        },
      })
    }
  }
})