//page外定义的是整个页面的全局变量
var app = getApp();
Page({
  /**
   * 页面加载时若未被其他function修改的初始数据
   */
  data: {
    username: "点击登录", //设置初始文本
    photoUrl: '/static/images/my.png', //设置初始头像路径
    hashLogin: app.globalData.hasLogin, //获取app的登录状态
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
    //直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的
    if (app.globalData.hasLogin) { //根据全局js保存的登录状态来进行判断是否登录
      //获取昵称 获取头像 获取登录状态
      this.setData({
        username: app.globalData.userInfo.userNickname,
        photoUrl: app.globalData.userInfo.userAvatar,
        hashLogin: app.globalData.hasLogin
      });
    } else {
      //设置文本为点击登录 设置为默认头像 获取登录状态
      this.setData({
        username: "点击登录",
        photoUrl: "/static/images/my.png",
        hashLogin: app.globalData.hasLogin
      });
    }
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
   * 点击之后跳转到选择登录方式
   */
  loginChoose: function () {
    //判断登录状态 
    if (app.globalData.hasLogin) {
      //已登录则跳转到个人详细信息 遗留

    } else {
      //未登录跳转到选择登录方式页面 redirectTo 关闭当前页面，跳转到应用内的某个页面，但是不允许跳转到tabbar页面
      wx.redirectTo({
        url: "../loginChoose/loginChoose",
      })
    }

  },
  /**
   * 点击之后弹出是否退出登录
   */
  loginout: function () {
    wx.showModal({
      content: "是否退出登录？",
      showCancel: true,
      success: function (res) {
        if (res.confirm) { //当用户点击确定退出后进行的操作
          //删除Storage缓存
          wx.removeStorageSync('token');
          wx.removeStorageSync('userinfo');
          //修改app.js的全局变量
          app.globalData.hasLogin = false;
          app.globalData.userInfo = null;
          //关闭所有页面，打开到应用内的某个页面
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
    })
  },

  //帮助中心跳转
  helpPage:function () {
    wx.reLaunch({
      url: '/pages/essentialTools/helpcenter/helpcenter',
    })
  },

  //浏览足迹跳转
  browseFootprint:function () {
    if (app.globalData.hasLogin) {
      //已登录则跳转浏览足迹页面
      wx.reLaunch({
        url: '/pages/coreservices/browseFootprint/browseFootprint',
      })
    } else {
      wx.showModal({
        content: "请先登录",
        showCancel: false,
        success: function () {
          wx.redirectTo({
            url: '../loginChoose/loginChoose',
          })
        }
      })
    }
  },

  //待付款页面跳转
  pendpay:function () {
    if (app.globalData.hasLogin) {
      //已登录则跳转到待付款页面
      wx.reLaunch({
        url: '',
      })
    } else {
      wx.showModal({
        content: "请先登录",
        showCancel: false,
        success: function () {
          wx.redirectTo({
            url: '../loginChoose/loginChoose',
          })
        }
      })
    }
  },

  //待发货页面跳转
  send:function () {
    if (app.globalData.hasLogin) {
      //已登录则跳转到代发货页面
      wx.reLaunch({
        url: '',
      })
    } else {
      wx.showModal({
        content: "请先登录",
        showCancel: false,
        success: function () {
          wx.redirectTo({
            url: '../loginChoose/loginChoose',
          })
        }
      })
    }
  },

  //待收货页面跳转
  receive:function () {
    if (app.globalData.hasLogin) {
      //已登录则跳转到待收货页面
      wx.reLaunch({
        url: '',
      })
    } else {
      wx.showModal({
        content: "请先登录",
        showCancel: false,
        success: function () {
          wx.redirectTo({
            url: '../loginChoose/loginChoose',
          })
        }
      })
    }
  },

  //待评价页面跳转
  comment:function () {
    if (app.globalData.hasLogin) {
      //已登录则跳转到待评价页面
      wx.reLaunch({
        url: '',
      })
    } else {
      wx.showModal({
        content: "请先登录",
        showCancel: false,
        success: function () {
          wx.redirectTo({
            url: '../loginChoose/loginChoose',
          })
        }
      })
    }
  },

  //售后页面跳转
  aftersale:function () {
    if (app.globalData.hasLogin) {
      //已登录则跳转到售后页面
      wx.reLaunch({
        url: '',
      })
    } else {
      wx.showModal({
        content: "请先登录",
        showCancel: false,
        success: function () {
          wx.redirectTo({
            url: '../loginChoose/loginChoose',
          })
        }
      })
    }
  },

  //地址管理页面跳转
  address:function () {
    if (app.globalData.hasLogin) {
      //已登录则跳转到地址管理界面
      wx.reLaunch({
        url: '/pages/coreservices/addressManagement/addressManagement',
      })
    } else {
      wx.showModal({
        content: "请先登录",
        showCancel: false,
        success: function () {
          wx.redirectTo({
            url: '../loginChoose/loginChoose',
          })
        }
      })
    }
  },

})