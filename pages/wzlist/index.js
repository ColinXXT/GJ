const wzList = [{ "province": "SX", "city": "SX_XA", "hphm": "陕AV05K8", "hpzl": "02", "lists": [{ "date": "2018 - 06 - 17 14: 28: 42", "area": "南二环", "act": "变更车道影响其他车辆行驶", "code": "1043", "fen": "0", "wzcity": "陕西西安", "money": "50", "handled": "0", "archiveno": "6101030004320642" }]}];
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wzList: [],
    driverLists:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var data = JSON.parse(options.wxDetails);
   console.log(data.result.lists)
    app.globalData.chejia = options.chejia,
    app.globalData.chepai = options.chepai
    this.setData({
      wzList: data.result.lists,
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 电话联系客服
   */
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '400-888-9999', //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
   /**
   * 用户下拉刷新
   */
  onPullDownRefresh: function () {

  },
})