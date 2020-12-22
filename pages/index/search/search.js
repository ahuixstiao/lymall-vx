var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    searchStatus: false, //搜索框 状态 false显示热门、历史搜索 true不显示
    categoryFilter: false, //按条件排序选项 false不显示 true显示排序选项


    goodsList: [], //商品信息
    filterCategory: [], //分类类型

    keyword: '', //输入的关键字
    currentSortType: 'default', //排序类型 综合 default  价格 price 分类 category
    currentSort: 'goods_name', //排序字段
    currentSortOrder: 'desc', //排序 升序或降序

    defaultKeyword: {}, //默认关键字
    hotKeyword: [], //热门关键字
    historyKeyword: [], //历史关键字
    helpKeyword: [], //帮助关键字

    currentPage: 1, //当前页
    limit: 20, //页面信息条数
    categoryId: 0 //分类id
  },

  //取消按钮事件
  closeSearch: function () {
    wx.navigateBack()
  },

  /**
   * 当用户点击输入框内的X时的点击事件
   * 清空输入框 并将热门、历史关键字展现
   */
  clearKeyword: function () {
    this.setData({
      keyword: "",
      searchStatus: false
    });
  },

  /**
   * 页面加载事件
   * 页面加载时 查询默认、热门、历史关键字
   */
  onLoad: function () {
    //执行该方法
    this.getSearchKeyword();
  },

  /**
   * 查询搜索页面关键字
   */
  getSearchKeyword() {
    let that = this;
    //检查用户是否登陆状态 并保存用户信息用于向服务器查询
    var userInfo = app.globalData.userInfo == null ? "" : app.globalData.userInfo;
    console.log(userInfo);
    wx.request({
      url: api.SearchIndex, //发送请求
      data: {
        "userInfo": userInfo,
        "currentPage": that.data.currentPage,
        "limit": that.data.limit
      },
      dataType: "json",
      method: "POST",
      header:{"content-type": "application/x-www-form-urlencoded"},
      success: function (result) {
        console.log(result);
        that.setData({
          defaultKeyword: result.data.defaultKeyword, //默认关键字
          hotKeyword: result.data.hotKeyword.data.list, //热门关键字
          historyKeyword: result.data.historyKeyword.data.list, //历史关键字 遗留 尚未解决userId传递
        });
      }
    });
  },

  /**
   * 获取商品信息
   */
  getGoodsList: function () {
    let that = this;
    let keyword = this.data.keyword; //获取用户输入的关键字
    let categoryId = this.data.categoryId; //获取用户选中的商品分类
    let orderCloumn = this.data.currentSort; //根据用户选中的排序类型 发送相应的字段
    let orderType = this.data.currentSortOrder; //获取排序方式
    //发送请求
    wx.request({
      url: api.SearchResult, //请求路径
      data: {
        "keyword": keyword,
        "categoryId": categoryId,
        "orderCloumn": orderCloumn,
        "orderType": orderType
      },
      dataType: "json",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (result) {
        console.log(result);
        that.setData({
          searchStatus: true,//将关键字模块隐藏
          categoryFilter: false,//显示排序方式选项
          goodsList: result.data.goodsList,
        });
      },
    })

    //重新获取关键词
    that.getSearchKeyword();
  },

  /**
   * 搜索框输入事件 用户输入关键字时也发送请求
   * @param {*} e 
   */
  inputChange: function (e) {
    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });
    //判断是否有值 有则执行请求
    if (e.detail.value) {
      this.getHelpKeyword();
    }
  },

  //获取帮助关键字
  getHelpKeyword: function () {
    let that = this;

    //用户没输入一个字都发送请求 来获取帮助关键字提示
    wx.request({
      url: 'url',
      data:{"keyword":keyword},

    })
  },

  //用户输入时获得焦点 隐藏其他信息
  inputFocus: function () {
    this.setData({
      searchStatus: false,
      goodsList: []
    });

    if (this.data.keyword) {
      this.getHelpKeyword();
    }

  },

  //点击删除历史记录事件
  clearHistory: function () {
    this.setData({
      historyKeyword: []
    })
    //发送请求 来删除历史关键字记录

  },

  //点击关键字事件
  onKeywordTap: function (event) {
    this.getSearchResult(event.target.dataset.keyword);
  },

  //获取搜索返回值
  getSearchResult(keyword) {
    if (keyword === '') {
      keyword = this.data.defaultKeyword.keyword;
    }
    this.setData({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      goodsList: []
    });

    this.getGoodsList();
  },

  //选择排序方式的点击事件
  openSortFilter: function (event) {
    let currentId = event.currentTarget.id;
    //选择分类时 按商品添加时间排序
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          categoryFilter: !this.data.categoryFilter,
          currentSortType: 'category',
          currentSort: 'goods_add_time',
          currentSortOrder: 'desc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          currentSortType: 'price',
          currentSort: 'goods_retail_price',
          currentSortOrder: tmpSortOrder,
          categoryFilter: false
        });
        //点击完成后发送查询商品信息请求
        this.getGoodsList();
        break;
      default:
        //综合排序
        this.setData({
          currentSortType: 'default',
          currentSort: 'goods_name',
          currentSortOrder: 'desc',
          categoryFilter: false,
          categoryId: 0,
        });
        this.getGoodsList();
    }
  },
  selectCategory: function (event) {
    let currentIndex = event.target.dataset.categoryIndex;
    let filterCategory = this.data.filterCategory;
    let currentCategory = null;
    for (let key in filterCategory) {
      if (key == currentIndex) {
        filterCategory[key].selected = true;
        currentCategory = filterCategory[key];
      } else {
        filterCategory[key].selected = false;
      }
    }
    this.setData({
      filterCategory: filterCategory,
      categoryFilter: false,
      categoryId: currentCategory.id,
      page: 1,
      goodsList: []
    });
    this.getGoodsList();
  },
  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  }
})