App({
  onLaunch: function () {
    /**
     * 重新编译后登录状态
     */
    //获取登录成功时保存的Storage参数
    var loginStatus=wx.getStorageSync('userinfo');
    //判断登录成功时保存的Storage参数是否存在
    if(loginStatus!=""){
      //登录状态设置为 true
      this.globalData.hasLogin=true;
      this.globalData.userInfo=loginStatus;
    }
    else{
      this.globalData.hasLogin=false;
      this.globalData.userInfo=null;
    }
  },
  globalData: {
    userInfo:null,//初始化登录数据
    hasLogin:false,//初始化登录状态
  }
})