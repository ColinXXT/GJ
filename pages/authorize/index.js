// pages/authorize/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
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
  bindGetUserInfo: function (e) {
    console.log(e)
    if (!e.detail.userInfo){
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.login();
  },
  login: function () {
    let that = this;
    wx.login({
      success: function (res) {
      console.log(res)
        wx.request({
          url: app.globalData.host + '/auth?jsCode=' + res.code,
          method: "POST",
          data: {
            nickName: wx.getStorageSync("userInfo").nickName,
            gender: wx.getStorageSync("userInfo").gender,
            province: wx.getStorageSync("userInfo").province,
            city: wx.getStorageSync("userInfo").city
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.httpStatus != 200) {
              // 登录错误
              wx.showModal({
                title: '温馨提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;

            }
            wx.setStorageSync('token', res.data.data)
            console.log(wx.getStorageSync('token'))
            // wx.setStorageSync('uid', res.data.data.uid)
            // 回到原来的地方放
            wx.showToast({
              title: '请重新选择服务',
              duration:1500,
              icon:"success"
            })
            wx.navigateBack()
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
  }
})