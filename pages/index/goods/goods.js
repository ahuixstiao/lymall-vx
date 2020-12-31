var app = getApp();
var api = require('../../../config/api');
var WxParse = require('../../../lib/wxParse/wxParse');

Page({
  data: {
    canShare: false,
    goodsId: 0,//商品id
    goods: {},//商品信息
    attribute: [],//商品参数
    issueList: [],//常见问题
    comment: [],//评论
    brand: {},//品牌商
    specificationList: [],//规格列表
    productList: [],
    relatedGoods: [],//推荐商品信息
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    tmpPicUrl: '',
    checkedSpecText: '规格数量选择',
    tmpSpecText: '请选择规格数量',
    checkedSpecPrice: 0,
    openAttr: false,
    openShare: false,
    collect: false,
    shareImage: '',
    soldout: false,

    currentPage: 1,
    limit: 10,
  },

  onShow: function() {
    // 页面显示
    var that = this;
    
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.id) {
      this.setData({
        goodsId: parseInt(options.id),//转为int类型并保存到data中
      });
    }
    //执行查询商品信息方法
    this.getGoodsInfo();
  },

  //获取常见问题信息
  getIssueInfo:function(){
    let that=this;
    wx.request({
      url: api.IssueList,
      data:{"currentPage":that.data.currentPage,"limit":that.data.limit},
      method:"POST",
      header:{"content-type": "application/x-www-form-urlencoded"},
      dataType:"json",
      success:function(result){
        that.setData({
          issueList:result.data.data.list,
        });
      }
    })
  },

  /**
   * 发送获取商品信息请求
   */
  getGoodsInfo: function() {
    let that = this;
    wx.request({
      url: api.SelectByGoodsIdFindGoods,
      data:{"goodsId":that.data.goodsId,"userId":app.globalData.userInfo.userId},
      dataType:"json",
      method:"POST",
      header:{"content-type": "application/x-www-form-urlencoded"},
      success:function(result){
        console.log(result)
        //保存商品信息
        var goods=result.data.goodsInfo.data;
        //将商品的详情图从字符串数组转换成json数组
        goods.goodsGallery=JSON.parse(result.data.goodsInfo.data.goodsGallery);
        //使用wx.parse方法将参数中的html标签转换成wx标签 并可通过goodsDetail来调用转换后的参数
        WxParse.wxParse("goodsDetail","html",goods.goodsDetail,that);
        that.setData({
          goods:goods,//保存商品信息
          attribute:result.data.goodsAttribute.data,//保存商品参数信息
          comment:result.data.comment.data.list//保存评价信息
        });
        //查询品牌商信息
        that.getBrandInfo(goods.brandId);
        //执行查询热门商品信息方法
        that.getGoodsRelated();
        //执行查询常见问题信息方法
        that.getIssueInfo();
      }
    })
  },

  /**
   * 根据商品的brandId发送请求查询商品的品牌商信息
   * @param {*} brandId 
   */
  getBrandInfo:function(brandId){
    let that=this;
    wx.request({
      url: api.SelectByBrandIdFindInfo,
      data:{"brandId":brandId},
      dataType:"json",
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded"},
      success:function(result){
        that.setData({
          brand:result.data.data
        });
      }
    })
  },

  // 获取推荐商品
  getGoodsRelated: function() {
    let that = this;
    wx.request({
      url: api.SelectByPopularProduct,
      data:{"currentPage":that.data.currentPage,"limit":that.data.limit},
      dataType:"json",
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded"},
      success:function(result){
        that.setData({
          relatedGoods:result.data.data.list
        });
      }
    })
  },

  // 规格选择
  clickSkuValue: function(event) {
    let that = this;
    let specName = event.currentTarget.dataset.name;
    let specValueId = event.currentTarget.dataset.valueId;

    //判断是否可以点击

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].name === specName) {
        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
          if (_specificationList[i].valueList[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].checked) {
              _specificationList[i].valueList[j].checked = false;
            } else {
              _specificationList[i].valueList[j].checked = true;
            }
          } else {
            _specificationList[i].valueList[j].checked = false;
          }
        }
      }
    }
    this.setData({
      specificationList: _specificationList,
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();

    //重新计算哪些值不可以点击
  },

  //获取选中的规格信息
  getCheckedSpecValue: function() {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        name: _specificationList[i].name,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;
  },

  //判断规格是否选择完整
  isCheckedAllSpec: function() {
    return !this.getCheckedSpecValue().some(function(v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },

  getCheckedSpecKey: function() {
    let checkedValue = this.getCheckedSpecValue().map(function(v) {
      return v.valueText;
    });
    return checkedValue;
  },

  // 规格改变时，重新计算价格及显示信息
  changeSpecInfo: function() {
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function(v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function(v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        tmpSpecText: checkedValue.join('　')
      });
    } else {
      this.setData({
        tmpSpecText: '请选择规格数量'
      });
    }

    if (this.isCheckedAllSpec()) {
      this.setData({
        checkedSpecText: this.data.tmpSpecText
      });

      // 规格所对应的货品选择以后
      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        this.setData({
          soldout: true
        });
        console.error('规格所对应货品不存在');
        return;
      }

      let checkedProduct = checkedProductArray[0];
      //console.log("checkedProduct: "+checkedProduct.url);
      if (checkedProduct.number > 0) {
        this.setData({
          checkedSpecPrice: checkedProduct.price,
          tmpPicUrl: checkedProduct.url,
          soldout: false
        });
      } else {
        this.setData({
          checkedSpecPrice: this.data.goods.retailPrice,
          soldout: true
        });
      }

    } else {
      this.setData({
        checkedSpecText: '规格数量选择',
        checkedSpecPrice: this.data.goods.retailPrice,
        soldout: false
      });
    }

  },

  // 获取选中的产品（根据规格）
  getCheckedProductItem: function(key) {
    return this.data.productList.filter(function(v) {
      if (v.specifications.toString() == key.toString()) {
        return true;
      } else {
        return false;
      }
    });
  },

  //添加或是取消收藏
  addCollectOrNot: function() {
    let that = this;
   
  },

  //立即购买（先自动加入购物车）
  addFast: function() {
    var that = this;
    if (this.data.openAttr == false) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr
      });
    } else {

      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {

        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        //找不到对应的product信息，提示没有库存
        return false;
      }

      let checkedProduct = checkedProductArray[0];
      //验证库存
      if (checkedProduct.number <= 0) {

        return false;
      }
    }
  },

  //添加到购物车
  addToCart: function() {
    var that = this;
    if (this.data.openAttr == false) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr
      });
    } else {

      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        //找不到对应的product信息，提示没有库存
        
        return false;
      }

      let checkedProduct = checkedProductArray[0];
      //验证库存
      if (checkedProduct.number <= 0) {
        
        return false;
      }

      //添加到购物车
      
    }

  },

  cutNumber: function() {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },

  addNumber: function() {
    this.setData({
      number: this.data.number + 1
    });
  },

  switchAttrPop: function() {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr
      });
    }
  },

  closeAttr: function() {
    this.setData({
      openAttr: false,
    });
  },

  closeShare: function() {
    this.setData({
      openShare: false,
    });
  },

  openCartPage: function() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
})