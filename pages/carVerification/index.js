
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadimage: "",
    condition: false,
    userInfo: {},
    results:[],
    driverLists:[],
    remind:'加载中'
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
    var self = this;
    wx.request({
      url: app.globalData.host + '/findAllCar',
      header: {
        'token': wx.getStorageSync('token')
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.httpStatus == 200) {
            self.setData({
              driverLists: res.data.data
            })
        } else if (res.data.httpStatus == 401) {
          wx.navigateTo({
            url: '../authorize/index',
          })
        } else {
          setTimeout(function () {
            wx.showToast({
              title: res.data.data,
              image: "../../images/more/error.png",
            })
          }, 1000)
        }
        setTimeout(function () {
          self.setData({
            remind: ''
          });
        }, 1000);
      }, fail(res) {      
        wx.showModal({
          title: '温馨提示',
          content: '请求超时，请重新选择服务项目',
          showCancel: false,
          success: function (res) {
            wx.navigateBack()
          }
        })
      }
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
  /**
   * 图片获取跟上传
   */
  bindChooseImage: function () {
    var that = this;

    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '上传扫描中',
          mask:true
        })
        console.log(tempFilePaths[0])
        wx.uploadFile({
          url: app.globalData.host + '/getCarLiencesInfo',
          filePath: tempFilePaths[0],
          name: 'image',
          header: {
            "Content-Type": "multipart/form-data",
            'token': wx.getStorageSync('token')
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(data)
            if (data.httpStatus == 200) {
              wx.navigateTo({
                url: "/pages/carVerificationResult/index?driverInfo=" + JSON.stringify(data.data)
              })
            } else if (data.httpStatus == 401) {
              wx.navigateTo({
                url: '../authorize/index',
              })
            } else {
              wx.showToast({
                title: '扫描失败',
                image: "../../images/more/error.png",
              })
            }
            wx.hideLoading()
          },
          fail: function (res) {
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
            wx.hideLoading()
          }
        });
      }
    });
  },
    /**
     * 选行驶证查询
     */
  radioChange: function (e) {
    var self = this;
    self.setData({
      results: e.detail.value.split(",")
    })
    this.goToResult();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
  * 新增驾驶证
  */
  addInfo: function () {
    this.setData({
      condition: true
    })
  },
  bindtap1: function () {
   this.goToResult();
  },
  /**
   * 去扫描结果页面
   * **/
  goToResult : function(){
    var result = this.data.results;
    if (result.length > 0) {
      wx.redirectTo({
        url: "/pages/carVerificationResult/index?type=radio&carNumber=" + result[0] + "&carType=" + result[1] + "&cjNumber=" + result[2] + "&fdjh=" + result[3] + "&owner=" + result[4] + "&registedDate=" + result[5]
      })
    }
  }
})