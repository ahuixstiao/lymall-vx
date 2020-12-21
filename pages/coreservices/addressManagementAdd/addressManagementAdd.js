const areaAddress = require("../../../utils/area")//获取地区列表
var api = require("../../../config/api");//获取url请求路径
const { address } = require("../../../config/api");
var app = getApp();//获取全局app.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //对象
    address: {
      name: "", //用户名称
      tel: "", //用户手机号码
      province: "北京", //省
      provinceCode: "110000",
      city: "市辖区", //市
      cityCode: "110100",
      county: "东城区", //区县
      countyCode: "110101",
      addressDetail: "", //详细收货地址
      isDefault: 0, //是否默认地址
    },
    openSelectRegion: false, //默认不显示列表框
    selectRegionDone: false, //用户选完地址后才可点击确定
    currentType: 0,//选中的地区类型 0省 1市 2区县
    regionList: [],//保存 省、市、区县的地址列表
    selectRegionList: [{ code: -1, name: '省份', }, { code: -1, name: '市', }, { code: -1, name: '区县', },],//顶部地区类型
  },

  /**
   * 获取用户输入的姓名
   * @param {*} e 
   */
  bindinputName: function (e) {
    let addressObject = this.data.address;
    addressObject.name = e.detail.value;
    this.setData({ address: addressObject })
  },
  /**
   * 获取用户输入的手机号
   * @param {*} e 
   */
  bindinputMobile: function (e) {
    let addressObject = this.data.address;
    //保存到全局对象中
    addressObject.tel = e.detail.value;
    this.setData({ address: addressObject })
  },
  /**
   * 获取用户输入的详细地址
   * @param {*} e 
   */
  bindinputAddress: function (e) {
    let addressObject = this.data.address;
    //保存到全局对象中
    addressObject.addressDetail = e.detail.value;
    this.setData({ address: addressObject })
  },
  /**
   * 设为默认地址点击事件
   */
  bindIsDefault: function () {
    let addressObject = this.data.address;
    //用户点击时判断是否勾选为默认地址 1默认 0不是默认
    if (this.data.address.isDefault == 0) {//默认为0 用户点击之后赋值为1
      addressObject.isDefault = 1;
    } else {
      addressObject.isDefault = 0;
    }
    this.setData({ address: addressObject });
  },
  /**
   * 点击取消返回收货地址页面
   */
  cancelAddress: function () {
    var page = getCurrentPages(); //获取当前页面栈。数组中第一个元素为上一个页面，最后一个元素为当前页面。
    console.log(page);
    wx.navigateBack({
      delta: 0, //返回上一个页面
    })
  },
  /**
   * 灰色区域点击事件
   */
  cancelSelectRegion: function () {
    //点击后退出列表框
    this.setData({
      openSelectRegion: false
    })
  },
  /**
  * 地区列表 确认按钮的点击事件
  */
  doneSelectRegion: function () {
    //点击后退出列表框
    this.setData({
      openSelectRegion: false
    });
  },

  /**
   * 地区输入框点击事件
   */
  chooseRegion: function () {
    //当地址输入框有值时并且当用户点击时 应该直接跳转到  区县列表
    if (this.data.address.provinceCode != -1) {
      //将数据绑定到已选择列表
      var currentRegionList = areaAddress.getList('county', this.data.address.countyCode.slice(0, 4));
      //弹出列表框时显示相应的地址
      this.setData({
        selectRegionList: [{
          code: this.data.address.provinceCode,
          name: this.data.address.province,
        },
        {
          code: this.data.address.cityCode,
          name: this.data.address.city,
        },
        {
          code: this.data.address.countyCode,
          name: this.data.address.county,
        },
        ],
        regionList: currentRegionList,
        currentType: 2
      });
    }
    else {//当地址输入框没有值时

      //点击后立即查询省份
      this.setData({
        regionList: areaAddress.getList("province")
      });
      //初始化地址列表
      this.setData({ currentType: this.data.currentType = 0 });
      //设置顶部标签的默认省、市、区县
      this.setData({
        selectRegionList: [{
          code: -1,
          name: '省份',
        }, {
          code: -1,
          name: '市',
        }, {
          code: -1,
          name: '区县',
        }]
      });
    }
    //点击地址输入框时弹出列表框
    this.setData({ openSelectRegion: true });
  },

  /**
   * 顶部地区类型点击事件
   * @param {*} e 
   */
  selectRegionType: function (e) {
    //获取用户点击的顶部地区类型的下标
    let selecIndenx = e.currentTarget.dataset.regionTypeIndex;
    
    //顶部标签下标 大于 用户选择的地区下标 且 当前的顶部标签为默认状态时不让用户点击后面的市/区县
    if (selecIndenx > this.data.currentType && this.data.selectRegionList[selecIndenx].code - 1) {
      return;
    }

    var currentRegionList; //保存区域列表
    //判断顶部标签当前下标状态 为0显示省 为1显示市 为2显示区县
    if (selecIndenx == 0) {
      this.setData({ regionList: areaAddress.getList('province'),currentType:selecIndenx});
    }
    else if (selecIndenx == 1) {
      this.setData({ regionList: areaAddress.getList('city', this.data.selectRegionList[0].code.slice(0, 2)),currentType:selecIndenx});
    }
    else if (selecIndenx == 2) {
      this.setData({ regionList: areaAddress.getList('county', this.data.selectRegionList[0].code.slice(0, 4)),currentType:selecIndenx});
    }

    //给列表中的对象加一个属性 selected
    for (var i = 0; i < currentRegionList.length; i++) {
      if (currentRegionList[i].code == this.data.selectRegionList[selectIndex].code) {
        currentRegionList[i].selected = true;
      }
      else {
        currentRegionList[i].selected = false;
      }
    }
  },

  /**
   * 选择地址点击事件
   * @param {*} e 
   */
  selectRegion: function (e) {
    let selectIndex = e.currentTarget.dataset.regionIndex; //根据用户选中的地址，获取选中的地址的下标索引
    let selectItem = this.data.regionList[selectIndex]; //获取选中地址的对象{code & name}
    let selectRegion = this.data.selectRegionList;//将顶部地区类型保存到临时变量中
    var currentRegionList; //保存区域列表

    //保存用户所选中的地区类型的地址下标的对象{name&code}
    selectRegion[this.data.currentType] = selectItem;

    //遍历地区类型长度
    for (let i = 0; i < selectRegion.length; i++) {
      if (i > this.data.currentType) {
        selectRegion[i] = {
          code: -1,
          name: i == 1 ? '市' : '区县'
        }
      }
    }
    //将用户选中的地区对象{name&code}保存到全局变量selectRegionList顶部地区类型中 这样发送请求时可以直接从该数组对象中取值
    this.setData({ selectRegionList: selectRegion });

    //判断用户选择的地址类型是否到达最终的区县 到达则不进入判断不再显示详细地区列表
    if (this.data.currentType < 2) {

      this.setData({ currentType: this.data.currentType + 1 }) //每次点击地区type加1

      //判断当前地区列表选择的位置 默认为0  0省 1市 2区县 
      if (this.data.currentType == 1) {
        currentRegionList = areaAddress.getList('city', selectItem.code.slice(0, 2)); // 市 city
      } else if (this.data.currentType == 2) {
        currentRegionList = areaAddress.getList('county', selectItem.code.slice(0, 4)); // 区县 county
      }

      //将区域列表返回到data的regionList
      this.setData({ regionList: currentRegionList });
    }
  },

  /**
   * 点击保存的点击事件
   */
  saveAddress: function () {
    let addressObject = this.data.address;//保存address对象方便从中取值
    let selectRegion = this.data.selectRegionList;//保存selectRegionList顶部地区类型数组集合方便从中取值

    //遍历获取address对象中的地址参数 这样可以从address默认值中取出参数并赋值给selectRegion
    for (let i = 0; i < 3; i++) {
      selectRegion[i].code = [i] <= 0 ? addressObject.provinceCode : [i] <= 1 ? addressObject.cityCode : addressObject.countyCode;
      selectRegion[i].name = [i] <= 0 ? addressObject.province : [i] <= 1 ? addressObject.city : addressObject.county;
    }

    //发送请求
    wx.request({
      url: api.AddressSave,
      data: {
        "addressName": addressObject.name, "addressTel": addressObject.tel,
        "regionProvinceId": selectRegion[0].code, "regionCityId": selectRegion[1].code,
        "regionCountyId": selectRegion[2].code, "addressAddressDetail": addressObject.addressDetail,
        "userId": app.globalData.userInfo.userId, "addressIsDefault": addressObject.isDefault
      },
      header: { "content-type": "application/x-www-form-urlencoded" },
      dataType: "json",
      method: "POST",
      success: function (result) {
        if (result.data.errno == 0) {
          wx.showModal({
            content: "收货地址添加成功",
            showCancel: false,
            success: function () {
              //重新导向地址查询
              wx.reLaunch({
                url: '../addressManagement/addressManagement',
              })
            }
          })
        } else {
          wx.showModal({
            content: "收货地址添加失败",
            showCancel: false
          })
        }
      }
    })

  }

})