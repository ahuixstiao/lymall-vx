var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    searchStatus: false, //搜索框 状态 false显示热门、历史搜索 true不显示
    categoryFilter: false, //按条件排序选项 false不显示 true显示排序选项


    goodsList: [], //商品信息
    filterCategory: [], //分类类型

    keyword: "", //输入的关键字
    currentSortType: 'default', //排序类型 综合 default  价格 price 分类 category
    currentSort: 'goods_name', //排序字段
    currentSortOrder: 'desc', //排序 升序或降序

    defaultKeyword: {}, //默认关键字
    hotKeyword: [], //热门关键字
    historyKeyword: [], //历史关键字
    helpKeyword: [], //搜索帮助关键字

    currentPage: 1, //当前页
    limit: 20, //页面信息条数
    categoryId: 0 //分类id
  },

  /**
   * 页面加载事件
   * 页面加载时 查询默认、热门、历史关键字
   */
  onLoad: function () {
    //执行查询关键字函数
    this.getSearchKeyword();
  },

  /**
   * 取消按钮事件
   */
  closeSearch: function () {
    //返回上一页
    wx.navigateBack()
  },

  /**
   * 回车事件 
   * @param {*} event 
   */
  onKeywordConfirm(event) {
    //当用户回车确定时将关键字发送 getSearchResult函数用以搜索商品信息
    this.getSearchResult(event.detail.value);
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
   * 搜索框输入事件 用户输入关键字时也发送请求查询相关商品关键字
   * @param {*} e 
   */
  inputChange: function (e) {
    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });
    //判断是否有值 有则执行请求
    if (e.detail.value) {
      this.getHelpKeyword(e.detail.value);
    }
    
  },

  // 搜索框获得焦点 隐藏关键字以外的其他信息
  inputFocus: function () {
    this.setData({
      searchStatus: false,
      goodsList: []
    });

    if (this.data.keyword) {
      this.getHelpKeyword();
    }

  },

  /**
   * 点击关键字事件
   * @param {*} event 
   */
  onKeywordTap: function (event) {
    //将用户选中的关键字发送到 getSearchResult函数
    this.getSearchResult(event.target.dataset.keyword);
  },

  /**
   * 获取用户输入的关键字用以查询商品信息 
   * 若获取到的关键字为空则设置搜索输入框内容为默认关键字
   * @param {*} keyword 
   */
  getSearchResult(keyword) {

    //若keyword为空时则设置搜索输入框内容为默认关键字
    if (keyword === '') {
      keyword = this.data.defaultKeyword.keyword;
    }
    
    //设置keyword为用户输入的关键字 并清空上一次搜索的商品信息与分类Id
    this.setData({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      goodsList: []
    });

    //调用搜索商品信息函数
    this.getGoodsList();
  },

  //---------------------------------------------------请求----------------------------------------------------------
  
  /**
   * 查询搜索页面关键字
   */
  getSearchKeyword() {
    let that = this;
    //检查用户是否登陆状态 若存在则返回userId 若不存在则返回null
    var userId = app.globalData.userInfo == null ? "" : app.globalData.userInfo.userId;
    wx.request({
      url: api.SearchIndex, //发送请求
      data: {
        "userId": userId,
        "currentPage": that.data.currentPage,
        "limit": that.data.limit
      },
      dataType: "json",
      method: "POST",
      header:{"content-type": "application/x-www-form-urlencoded"},
      success: function (result) {
        that.setData({
          defaultKeyword: result.data.defaultKeyword, //默认关键字
          hotKeyword: result.data.hotKeyword.data.list, //热门关键字
          historyKeyword: result.data.historyKeyword.data.list, //历史关键字
        });
      }
    });
  },

  /**
   * 搜索商品信息请求
   */
  getGoodsList: function () {
    let that = this;
    let keyword = this.data.keyword; //用户输入的关键字
    let categoryId = this.data.categoryId; //用户选中的商品分类
    let orderCloumn = this.data.currentSort; //用户选中的排序类型 发送相应的字段
    let orderType = this.data.currentSortOrder; //排序方式
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
        that.setData({
          searchStatus: true,//将关键字模块隐藏
          categoryFilter: false,//显示排序方式选项
          goodsList: result.data.goodsList,//保存查询到的商品信息
          filterCategory: result.data.filterCategory,//保存查询到的分类信息
        });
        console.log(result);
        //查询成功并向历史关键字表插入一条记录
        that.setSearchHistoryKeyword(keyword);
      },
    });

    //重新获取关键词 防止用户搜索后历史记录无法同步显示
    that.getSearchKeyword();
  },

  /**
   * 历史关键字添加请求
   * 根据用户输入的关键字插入到历史关键字记录表
   * 若已登录则插入到用户的历史记录下
   * @param {*} keyword 
   */
  setSearchHistoryKeyword: function (keyword) {
    let that=this;
    let userId=app.globalData.userInfo==null? 0 : app.globalData.userInfo.userId;
    wx.request({
      url: api.SearchClearHistory,
      data:{"keyword":keyword,"userId":userId},
      dataType:"json",
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded"},
      success:function(result){
        //插入成功后查询一次关键字
        if(result.data.errno==0){
          that.getSearchKeyword();
        }
      }
    })
  },

  /**
   * 删除历史关键字请求与事件
   */
  clearHistory: function () {
    let that=this;
    let userId=app.globalData.userInfo==null? 0 : app.globalData.userInfo.userId;
    //发送请求 来删除数据库的历史关键字记录
    wx.request({
      url: api.SearchClearHistory,
      data:{"userId":userId},
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded"},
      success:function(result){
        if(result.data.errno==0){
          that.setData({
            //后台关键字清除成功时清除关键字
            historyKeyword: []
          })
        }
      }
    })
  },

  /**
   * 获取关键字提示帮助请求
   * @param {*} keyword 
   */
  getHelpKeyword: function (keyword) {
    let that = this;
    //用户每输入一个字都发送请求 来获取关键字帮助提示
    wx.request({
      url: api.SearchHelper,
      data:{"keyword":keyword},
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded"},
      success:function(result){
        that.setData({
          helpKeyword:result.data.helpKeyword
        });
      }
    })
  },

  
  /**
   * 选择排序方式的点击事件
   * @param {*} event 
   */
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
    //查询商品信息
    this.getGoodsList();
  },
  
})