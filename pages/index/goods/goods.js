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
    productList: [], //选中的商品规格
    relatedGoods: [],//推荐商品信息
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,//商品数量
    tmpPicUrl: '',//商品图片
    checkedSpecPrice: 0,//所选商品价格
    checkedSpecText: '规格数量选择',//商品详情页面默认显示的 商品规格数量等
    tmpSpecText: '请选择规格数量',
    openAttr: false,
    openShare: false,
    collect: false,
    shareImage: '',
    soldout: false,

    currentPage: 1,
    limit: 10,
  },
  /**
   * 页面加载时
   * @param {*} options 
   */
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
    let userId=app.globalData.userInfo!=null?app.globalData.userInfo.userId:""
    wx.request({
      url: api.SelectByGoodsIdFindGoods,
      data:{"goodsId":that.data.goodsId,"userId":userId},
      dataType:"json",
      method:"POST",
      header:{"content-type": "application/x-www-form-urlencoded"},
      success:function(result){
        //保存商品信息
        var goods=result.data.data.goodsInfo;
        //将商品的详情图从字符串数组转换成json数组
        goods.goodsGallery=JSON.parse(result.data.data.goodsInfo.goodsGallery);
        //使用wx.parse方法将参数中的html标签转换成wx标签 并可通过goodsDetail来调用转换后的参数
        WxParse.wxParse("goodsDetail","html",goods.goodsDetail,that);
        that.setData({
          goods:goods,//保存商品信息
          checkedSpecPrice:goods.goodsRetailPrice,//保存商品价格
          tmpPicUrl:goods.goodsPicUrl,//保存商品图片
          attribute:result.data.data.goodsAttribute,//保存商品参数信息
          comment:result.data.data.comment.data.list,//保存评价信息
          specificationList:result.data.data.specificationList,//保存商品规格
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
      url: api.BrandDetail,
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
    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let specName = event.currentTarget.dataset.name;//保存当前选中的商品规格
    let specValueId = event.currentTarget.dataset.valueId;//保存当前选中的商品规格id
    let _specificationList = this.data.specificationList;//保存商品规格数组
    //遍历数组
    for (let i = 0; i < _specificationList.length; i++) {
      //判断用户是否选中商品规格
      if (specName==_specificationList[i].goodsSpecifications[i].goodsSpecificationValue) {
        for (let j = 0; j < _specificationList[i].goodsSpecifications.length; j++) {
          //判断内层数组中的规格id是否存在用户所选中的规格id
          if (_specificationList[i].goodsSpecifications[j].goodsSpecificationId == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].goodsSpecifications[j].checked) {
              _specificationList[i].goodsSpecifications[j].checked = false;
            } else {
              _specificationList[i].goodsSpecifications[j].checked = true;
            }
          } else {
            _specificationList[i].goodsSpecifications[j].checked = false;
          }
        }
      }
    }
    //将规格的选中状态返回 被选中的规格 checked状态为true
    that.setData({
      specificationList: _specificationList,
    });

    //重新计算spec改变后的信息
    this.changeSpecInfo();
  },

  /**
   * 获取选中的规格信息 并保存选中的规格
   */
  getCheckedSpecValue: function() {
    let that=this;
    let checkedValues = [];
    //保存商品规格数组
    let _specificationList = this.data.specificationList;
    //遍历数组外层获取规格的name属性
    for (let i = 0; i < _specificationList.length; i++) {
      //保存选中的商品规格name
      let _checkedObj = {
        name: _specificationList[i].name,
        valueId: 0,
        valueText: ''
      };
      //遍历数组内层获取对应外层name的规格信息
      for (let j = 0; j < _specificationList[i].goodsSpecifications.length; j++) {
        if (_specificationList[i].goodsSpecifications[j].checked) {
          //获取规格id
          _checkedObj.valueId = _specificationList[i].goodsSpecifications[j].goodsSpecificationId;
          //获取规格参数
          _checkedObj.valueText = _specificationList[i].goodsSpecifications[j].goodsSpecificationValue;
        }
      }
      //推送选中的商品规格
      checkedValues.push(_checkedObj);
    }
    //保存选中的规格参数
    that.setData({productList:checkedValues});
    
    //并通过该规格查询 价格与商品剩余数量等
    wx.request({
      url: 'url',
    })

    //该方法返回一个商品规格数组
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

  /**
   * 获取选中的规格文本与参数
   */
  getCheckedSpecKey: function() {
    let checkedValue = this.getCheckedSpecValue().map(function(v) {
      return v.valueText;
    });
    return checkedValue;
  },

  // 获取选中的产品（根据规格）
  getCheckedProductItem: function(key) {
    let that=this;
    //返回参数与状态
    return this.data.productList.filter(function(v) {
      for(let i=0;i<=that.data.productList.length;i++){
        //判断选中的商品与传递过来的商品是否一致
        if (key[i]==v.valueText) {
          return true;
        } else {
          return false;
        }
      }
    });
  },

  /**
   * 规格改变时，重新计算价格及显示信息
   */
  changeSpecInfo: function() {
    //获取选中的规格信息
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
    //判断规格参数是否选择完整
    if (this.isCheckedAllSpec()) {
      this.setData({
        checkedSpecText: this.data.tmpSpecText
      });
      // 规格所对应的货品选择以后
      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
      //判断规格所对应的货品是否存在
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        //将该货品设为已售空
        this.setData({
          soldout: true
        });
        console.error('规格所对应货品不存在');
        return;
      }

      let checkedProduct = checkedProductArray[0];
      if (checkedProduct.number > 0) {
        this.setData({
          checkedSpecPrice: checkedProduct.goodsRetailPrice,
          tmpPicUrl: checkedProduct.goodsPicUrl,
          soldout: false
        });
      } else {
        this.setData({
          checkedSpecPrice: this.data.goods.goodsRetailPrice,
          soldout: true
        });
      }
    } else {
      this.setData({
        checkedSpecText: '规格数量选择',
        checkedSpecPrice: this.data.goods.goodsRetailPrice,
        soldout: false
      });
    }
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
        wx.showModal({
          content:"请选择完整规格",
          showCancel: false,
        })
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
        wx.showModal({
          content:"请选择完整规格",
          showCancel: false,
        })
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
      wx.request({
        url: 'url',
      })
    }

  },

  //商品数量 减
  cutNumber: function() {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },

  //商品数量 加
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