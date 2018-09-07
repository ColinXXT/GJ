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
    this.setData({
      wzList: data.result.lists
      
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
    // 显示顶部刷新图标 
    // wx.showNavigationBarLoading();
  //   var that = this;
  //   console.log(that.data.wzList[0]) 
  //   wx.request({
  //     url: app.globalData.host + 'saveCarLience',
  //     data: {
  //       "carNumber": that.data.wzList[0].chepaiValue,
  //       "carType": that.data.wzList[0].carTypesValue,
  //       "cjNumber": that.data.wzList[0].chejiaValue,
  //       "fdjh": that.data.wzList[0].fadongjiValue,
  //       "owner": that.data.wzList[0].owner
  //     },
  //     header: {
  //       'token': wx.getStorageSync('token')
  //     },
  //     method: "POST",
  //     success: function (res) {
  //       var res = res;
  //       console.log("response", res);
  //       if (res.data.httpStatus == 200) {
  //          that.setData({
  //            wzList:res.data.data
  //          })
          
  //       } else if (res.data.httpStatus == 401) {
  //         wx.navigateTo({
  //           url: '../authorize/index',
  //         })
  //       } else {
  //         wx.showToast({
  //           title: '刷新失败',
  //           icon: "none"
  //         })
  //       }
  //       // 隐藏导航栏加载框
  //       wx.hideNavigationBarLoading();
  //       // 停止下拉动作
  //       wx.stopPullDownRefresh();
  //     }, fail(res) {
  //       console.log(res)
  //       wx.showModal({
  //         title: '温馨提示',
  //         content: '请求超时，请重新选择服务项目',
  //       })
  //       // 隐藏导航栏加载框
  //       wx.hideNavigationBarLoading();
  //       // 停止下拉动作
  //       wx.stopPullDownRefresh();
  //     }
  //   })
  }
})