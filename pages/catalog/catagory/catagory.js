var api = require('../../../config/api.js');

Page({
  data: {
    navList: [], //顶部导航列表
    goodsList: [], //商品列表
    id: 0, //分类id
    categoryName : "",//父分类
    currentCategory: {}, //当前选中的子分类对象
    scrollLeft: 0,
    scrollTop: 0, //选中的子分类排序下标
    scrollHeight: 0,
    //首页方式进入分类详情页面 传递一个父分类Id 查询出子分类与第一个子分类的商品信息
    //分类页面进入 通过页面栈获取分类页面的父分类名称、子分类、通过子分类查询商品信息
    //如何区分通过何种方式进入？ id
    page: 1,
    limit: 10
  },

  /**
   * 页面加载 获取到分类页面传递过来的分类id
   * 并且获取分类页面的当前选中的分类对象
   * @param {*} options 
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    if (options.id&&options.categoryName) {
      that.setData({
        id: parseInt(options.id),
      });

      //顶部父分类名称
      wx.setNavigationBarTitle({
        title: options.categoryName
      });
      //由于通过首页进入分类详情只传递一个父分类ID所以需要查询子分类
      this.getCategoryInfo();
    }
    else{  
    //当用户通过分类页面进入分类详情页时获取上个页面的信息
    //获取页面栈
    let page = getCurrentPages();
    //获取上个页面的信息栈 -1是获取当前页面 -2是获取上一个页面
    let prevPage = page[page.length - 2];

    that.setData({
      id:parseInt(options.id),//获取点击的子分类id
      navList: prevPage.data.currentSubCategoryList, //获取上个页面选中的父类的子分类集合
      currentCategory: prevPage.data.currentSubCategoryList[that.data.scrollTop],//获取第一个子分类的信息
    });

    //获取父分类名称
    let titleCategoryName = prevPage.data.currentCategory.categoryName;
    //顶部父分类名称
    wx.setNavigationBarTitle({
      title: titleCategoryName
    });

    //通过分类页面进入则通过页面栈获取数据 可直接根据分类页面的子分类id查询商品信息
    this.getGoodsList();
    }

    wx.getSystemInfo({
      success: function (result) {
        that.setData({
          scrollHeight: result.windowHeight
        });
      }
    });
  },

  /**
   * 根据categoryId查询子分类信息
   */
  getCategoryInfo: function () {
    let that = this;
    wx.request({
      url: api.CatalogCurrentCategory,
      data: {
        "categoryPid": that.data.id//父分类Id
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (result) {
        if (result.data.errno == 0) {
          // 当id是父分类id时，这里需要重新设置成父分类的一个子分类的id
          if (that.data.id==result.data.data[0].categoryPid) {
            that.setData({
              id: result.data.data[that.data.scrollTop].categoryId,
              navList: result.data.data,//保存查询到的子分类信息
              currentCategory:result.data.data[0],//保存第一个子分类信息
            });
          }
          //nav位置
          let currentIndex = 0;
          let navListCount = that.data.navList.length;
          for (let i = 0; i < navListCount; i++) {
            currentIndex += 1;
            if (that.data.navList[i].categoryId == that.data.id) {
              break;
            }
          }
          if (currentIndex > navListCount / 2 && navListCount > 5) {
            that.setData({
              scrollLeft: currentIndex * 60
            });
          }
          that.getGoodsList();
        }
      }
    });
  },

  /**
   * 获取选中的子分类的商品信息
   */
  getGoodsList: function () {
    var that = this;
    var categoryId =this.data.id;
    //发送请求
    wx.request({
      url: api.CatagoryGoodsInfo,
      data: {
        "categoryId": categoryId
      },
      dataType: "json",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (result) {
        if (result.data.errno == 0) {
          that.setData({
            goodsList: result.data.data, //保存商品信息
          });
        }
      }
    })
  },

  /**
   * 选中的子分类
   * @param {*} event 
   */
  switchCate: function (event) {
    console.log(event)
    //判断是否选中同一个 
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      id: event.currentTarget.dataset.id,
      currentCategory:that.data.navList[event.currentTarget.dataset.index],
    });

    //查询商品信息
    this.getGoodsList();
  }
})