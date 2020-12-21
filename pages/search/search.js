var api = require('../../config/api.js');
var app = getApp();

Page({
  data: {
    keywrod: '',
    searchStatus: false,
    goodsList: [],
    helpKeyword: [],
    historyKeyword: [],
    categoryFilter: false,
    currentSort: 'name',
    currentSortType: 'default',
    currentSortOrder: 'desc',
    filterCategory: [],

    defaultKeyword: {},//默认关键字
    hotKeyword: [],//热门关键字
    
    currentPage: 1,//当前页
    limit: 20,//页面信息条数
    categoryId: 0//分类id
  },
  //事件处理函数
  closeSearch: function() {
    wx.navigateBack()
  },
  clearKeyword: function() {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  onLoad: function() {
    //页面加载时 查询默认关键字与热门关键字与用户关键字
    this.getSearchKeyword();
  },
  //查询关键字
  getSearchKeyword() {
    let that = this;
    let userInfo=app.globalData.userInfo!=null?app.globalData.userInfo:"";
    wx.request({
      url: api.SearchIndex,//发送请求
      data:{"userInfo":userInfo,"currentPage":that.data.currentPage,"limit":that.data.limit},
      dataType:"json",
      method:"POST",
      header: {"content-type":"application/x-www-form-urlencoded"},
      success:function(result){
        console.log(result);
        that.setData({
          defaultKeyword:result.data.defaultKeyword,//默认关键字
          hotKeyword:result.data.hotKeyword.data.list,//热门关键字
          
        });
      }
    });
  },

  inputChange: function(e) {
    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });

    if (e.detail.value) {
      this.getHelpKeyword();
    }
  },
  getHelpKeyword: function() {
    let that = this;

    //发送请求
  },
  inputFocus: function() {
    this.setData({
      searchStatus: false,
      goodsList: []
    });

    if (this.data.keyword) {
      this.getHelpKeyword();
    }
  },
  clearHistory: function() {
    this.setData({
      historyKeyword: []
    })
      //发送请求
  },

  getGoodsList: function() {
    let that = this;
    
      //发送请求


      //重新获取关键词
      that.getSearchKeyword();
  },
  onKeywordTap: function(event) {

    this.getSearchResult(event.target.dataset.keyword);

  },
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
  openSortFilter: function(event) {
    let currentId = event.currentTarget.id;
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          categoryFilter: !this.data.categoryFilter,
          currentSortType: 'category',
          currentSort: 'add_time',
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
          currentSort: 'retail_price',
          currentSortOrder: tmpSortOrder,
          categoryFilter: false
        });

        this.getGoodsList();
        break;
      default:
        //综合排序
        this.setData({
          currentSortType: 'default',
          currentSort: 'name',
          currentSortOrder: 'desc',
          categoryFilter: false,
          categoryId: 0,
        });
        this.getGoodsList();
    }
  },
  selectCategory: function(event) {
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