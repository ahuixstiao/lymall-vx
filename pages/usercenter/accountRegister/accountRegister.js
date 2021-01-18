const api = require("../../../config/api");
var app=getApp();
// pages/usercenter/accountRegister/accountRegister.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户名
    username:"",
    //密码
    password:"ahui",
    //确认密码
    rePassword:"ahui",
    //手机号 
    userMobile:"",
    //昵称
    userNickname:"昵称不知道起什么",
    //默认头像图片
    userAvatar:"/static/images/userhoto.png",
    //用户性别
    chankedValue:"",
    //性别选项
    items:[
      {id:0,name:"男",value:0,checked:'true'},
      {id:1,name:"女",value:1},
      {id:2,name:"隐藏",value:2},
    ]
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取默认选中的单选按钮值
    for(let i=0; i<this.data.items.length; i++){//遍历按钮数组的所有对象
      if(this.data.items[i].checked){//判断哪个按钮是默认选中checked为true 则将按钮选项赋值给Data
        this.setData({checkedValue:this.data.items[i].value});
      }
    }
  },

  //获取用户名
  usernameInput:function(e){
    let uname=e.detail.value;
    this.setData({username:uname});
  },
  //获取密码
  passwordInput:function(e){
    let pasw=e.detail.value;
    this.setData({password:pasw})
  },
  //获取确认密码
  rePasswordInput:function(e){
    let repasw=e.detail.value;
    this.setData({rePassword:repasw})
  },
  //获取手机号
  userMobileInput:function(e){
    let phone=e.detail.value;
    this.setData({userMobile:phone})
  },
  //获取用户昵称
  userNicknameInput:function(e){
    let Nickname=e.detail.value;
    this.setData({userNickname:Nickname})
  },
  //获取用户选中性别
  handleChange:function(e) {
    let checked = e.detail.value//获取选中的值
    let changed = {}//使用对象来保存单选按钮的下标与状态 true或false
    for (let i = 0; i < this.data.items.length; i++) {//遍历整个单选按钮的所有选项
      if (checked.indexOf(this.data.items[i].value)!=-1) {//判断条件选中按钮下标不等于-1
        changed['items['+i+'].checked'] = true  //保存checked状态为 true的按钮
      } else {
        changed['items['+i+'].checked '] = false //保存checked状态为 false的按钮
      }
    }
    this.setData({checkedValue:checked})
  },
  //获取用户头像
  chooseImage:function(){
    var that=this;//将全局的this保存
    wx.showActionSheet({
      itemList: ['相册','拍照'],//设置一个选项数组
      itemColor:"#9880FE",//选项字体颜色
      success:function(res){//选项的回调函数
        if(res.tapIndex==0){
          //打开本地相册
          wx.chooseImage({
            count: 1,//单次上传选择图片的数量
            sizeType:['original'],//所选的图片的尺寸 original原图 compressed压缩图
            sourceType:['album'], // 可以指定来源是相册还是相机，默认二者都有  相册'album'   相机'camera'
            success: function(res) {
              const tempFilePaths=res.tempFilePaths;//保存图片路径
              that.setData({userAvatar:tempFilePaths[0]})//将图片路径赋值给userAvatar实现图片的替换效果
            }
          })
        }
        else{
          wx.chooseImage({
            count: 1,//单次上传选择图片的数量
            sizeType:['original'],//所选的图片的尺寸 original原图 compressed压缩图
             sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有  相册'album'   相机'camera'
            success: function(res) {
              var tempFilePaths=res.tempFilePaths;//保存图片路径
              that.setData({userAvatar:tempFilePaths[0]})//将图片路径赋值给userAvatar实现图片的替换效果
            }
          })
        }
      }
    })
  },

  //用户注册信息提交
  register:function(){
    //let 块级元素 作用于一个funcation中 类似局部变量
    //声明变量来获取用户输入的参数
    let username=this.data.username;//用户名
    let password=this.data.password;//密码
    let rePassword=this.data.rePassword;//确认密码
    let userMobile=this.data.userMobile;//手机号
    let userNickname=this.data.userNickname;//昵称
    let userGender=this.data.checkedValue;//性别
    let userAvatar=this.data.userAvatar;//头像
    //判断所有的输入框是否为空
    if(username==""){
      wx.showModal({
        content:"请输入用户名",
        showCancel:false
      })
      return false;
    }else if(password==""){
      wx.showModal({
        content:"请输入密码",
        showCancel:false
      })
      return false;
    }else if(rePassword!=password){
      wx.showModal({
        content:"请核对两次输入的密码是否一致",
        showCancel:false
      })
      return false;
    }else if(userMobile==""){
      wx.showModal({
        content:"请输入手机号",
        showCancel:false
      })
      return false;
    }else if(userNickname==""){
      wx.showModal({
        content:"请输入昵称",
        showCancel:false
      })
      return false;
    }

    wx.uploadFile({
      filePath:userAvatar,//发送的文件路径
      name: 'pohoURL',//后台需要获取的file name
      url:api.AuthRegister,//请求url
      formData:{"userUsername":username,"userPassword":password,"userNickname":userNickname,"userMobile":userMobile,"userGender":userGender},//除了文件之外的表单数据
      success:function(result){
        //将返回的数据使用Json.parse解析
        let data=JSON.parse(result.data);
        if(data.errno==0){
          wx.showModal({
            content:"注册成功",
            showCancel:false,
            success:function(res){
              if(res.confirm){
                wx.request({
                  url: api.AuthLoginByAccount,//请求地址
                  data: {"userUsername":username,"userPassword":password},//请求参数
                  header:{"content-type":"application/x-www-form-urlencoded"},//设置请求的header，header中不能设置Referer content-type 默认为application/json
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
                      //跳转至个人中心
                      wx.reLaunch({
                      url: '../userindex/userindex',
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
        }else{
          wx.showModal({
            content:data.errorMessage,
            showCancel:false
          })
        }
      }
    })
  }
})