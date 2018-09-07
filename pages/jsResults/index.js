var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jszValue: "",
    uploadimage: "",
    wzOrder: "",
    wzfk: "",
    act: "",
    wzcity: "",
    wzdate: "",
    xsz: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var tempUploadimage = options.uploadimage;
    this.setData({
      jszValue: "140105199510033312",
      uploadimage: tempUploadimage,
      wzOrder: options.wzOrder,
      wzfk: options.wzfk,
      act: options.act,
      wzcity: options.wzcity,
      wzdate: options.wzdate,
      xsz: options.xsz
    })
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  submitOrder:function(){
    var that =this;
   wx.navigateTo({
     url: "../dxwz/index?wzOrder=" + that.data.wzOrder + "&wzfk=" + that.data.wzfk + "&xsz=" + that.data.xsz + "&wzdate=" + that.data.wzdate + "&wzcity=" + that.data.wzcity + "&act=" + that.data.act 
   })
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

  //事件处理函数
  bindChooseImage: function () {
    var that = this
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          uploadimage: tempFilePaths[0]
        })
      }
    })
  },
  
  /**
   * 
   * 
  */
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})