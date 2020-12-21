const api = require("../../../config/api");
var app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //声明该数组来保存后台返回的收货地址数据
    addressList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getaddress();//调用查询地址信息函数

  },
   //添加地址页面跳转
   addressAdd:function(){
    wx.navigateTo({
      url: '../addressManagementAdd/addressManagementAdd',
    })
  },
  //修改页面跳转
  addressAddOrUpdate:function(){
    wx.navigateTo({
      url: '../addressManagementAdd/addressManagementAdd',
    })
  },

  /**
   * 根据用户点击的地址信息进行删除
   */
  deleteAddress:function(e){
    //获取要删除的用户收货地址id
    let addressId=e.currentTarget.dataset.addressId;
    //let Address=e.dedail.addressId;
    wx.showModal({
      content:"是否删除该地址信息？",
      showCancel:true,
      success:function(res){
        //用户点击确定时执行删除
        if(res.confirm){
          wx.request({
            url: api.AddressDelete,
            data:{"addressId":addressId},
            dataType:"json",
            method:"POST",
            header:{"content-type":"application/x-www-form-urlencoded"},
            success:function(result){
              if(result.data.errno==0){
                wx.showModal({
                  content:"删除成功",
                  showCancel:false
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
      }
    })
  },

  /**
   * 根据用户id来获取地址信息
   */
  getaddress:function(){
    let userId=app.globalData.userInfo.userId;
    var that=this;
    wx.request({
      url: api.AddressList,
      data:{"userId":userId},
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded"},
      dataType:"json",
      success:function(result){
        if(result.data.errno==0){
          //保存返回的地址集合
          that.setData({addressList:result.data.data})
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