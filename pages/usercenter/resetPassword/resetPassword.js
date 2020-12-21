const api = require("../../../config/api");

// pages/usercenter/resetPassword/resetPassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    userMobile:"",
    password:"",
    repassword:""
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
  //获取用户名键盘事件
  usernameInput:function(e){
    let user=e.detail.value;
    this.setData({username:user})
  },
  //获取手机号键盘事件
  phoneNumleInput:function(e){
    let phoneNum=e.detail.value;
    this.setData({userMobile:phoneNum})
  },
  //获取密码键盘事件
  passwordInput:function(e){
    let pasw=e.detail.value;
    this.setData({password:pasw})
  },

  //获取确认密码键盘事件
  rePasswordInput:function(e){
    let repasw=e.detail.value;
    this.setData({repassword:repasw})
  },

  resetPasswordSubmit:function(){
    //先验证用户名与手机号 正确 保存用户名并隐藏两个输入框 显示密码框
    let userUsername=this.data.username;
    let userMobile=this.data.userMobile;
    let userPassword=this.data.password;
    let rePassword=this.data.repassword;
    if(userUsername==""){
      wx.showModal({
        content:"用户名不允许为空",
        showCancel:false
      })
      return false;
    }
    if(userMobile==""){
      wx.showModal({
        content:"手机号不允许为空",
        showCancel:false
      })
      return false;
    }
    if(userPassword==""){
      wx.showModal({
        content:"密码不允许为空",
        showCancel:false
      })
      return false;
    }
    if(rePassword!=userPassword){
      wx.showModal({
        content:"请核对密码是否一致",
        showCancel:false
      })
      return false;
    }

    wx.request({
      url:api.AuthReset,
      data:{"userUsername":userUsername,"userMobile":userMobile,"userPassword":userPassword},
      method:"POST",
      dataType:"json",
      success:function(result){
        if(result.data.errno==0){
          wx.showModal({
            content:"修改成功",
            showCancel:false,
            success:function(){
              wx.reLaunch({
                url: '../accountLogin/accountLogin',
              })
            }
          })
        }else{
          wx.showModal({
            content:result.data.errorMessage,
            showCancel:false
          })
        }
      }
    })
  }
  



})