var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productInfo: {},
    uploadimage:""  ,
    carLincenseList:[],
    condition:false,
    wzOrder: "",
    wzfk: "",
    act: "",
    wzcity: "",
    wzdate: "",
    xsz: "",
    xsznumber:'',
    price:'',
    chepai:'',
    chejia:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
      this.setData({
        wzOrder: options.wzOrder,
        wzfk: options.wzfk,
        act: options.act,
        wzcity: options.wzcity,
        wzdate: options.wzdate,
        chepai:app.globalData.chepai,
        chejia:app.globalData.chejia
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getPrice(); 
    this.getDriveList()
  },
  getDriveList: function(){
    console.log("getSvsList Api")
    var self = this;
    console.log(app.globalData.host + 'personLicence/findAllById')
    console.log(wx.getStorageSync('token'))

    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.globalData.host + 'personLicence/findAllById',
      header: {
        'token': wx.getStorageSync('token')
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.httpStatus == 200) {
          self.setData({
            carLincenseList: res.data.data
          })
          wx.hideLoading()
        } else if (res.data.httpStatus == 401) {
          wx.navigateTo({
            url: '../authorize/index',
          })
          wx.hideLoading()
        } else {
          setTimeout(function () {
            wx.showToast({
              title: res.data.data,
              icon: 'none'
            })
          }, 1000)
        }
        wx.hideLoading()
      }, fail(res) {
        console.log(res)
        wx.showModal({
          title: '错误提示',
          content: '网络异常，请返回重新选择',
          showCancel: false,
          success: function (res) {
            wx.navigateBack()
          }
        })
        wx.hideLoading()
      }
    })
  },
  getPrice: function(){
    var self = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: app.globalData.host + '/product/getWZPrice?price=' + self.data.wzfk,
      header: {
        'token': wx.getStorageSync('token')
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.httpStatus == 200) {
          self.setData({
            price: res.data.data
          })
          wx.hideLoading()
        } else if (res.data.httpStatus == 401) {
          wx.navigateTo({
            url: '../authorize/index',
          })
          wx.hideLoading()
        } else {
          setTimeout(function () {
            wx.showToast({
              title: res.data.data,
              icon: 'none'
            })
          }, 1000)
        }
        wx.hideLoading()
      }, fail(res) {
        console.log(res)
        wx.showModal({
          title: '错误提示',
          content: '网络异常，请返回重新选择',
          showCancel: false,
          success: function (res) {
            wx.navigateBack()
          }
        })
        wx.hideLoading()
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

  submitOrder:function(){
    if(this.data.xsznumber!=""){
      wx.showToast({
        title: '下单成功',
      })
    }else{
      wx.showToast({
        title: '请选择驾驶证',
        icon:"none"
      })
    }
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
        console.log(tempFilePaths[0])
        //启动上传等待中...  
        wx.showLoading({
          title: '正在上传扫描',
        })
        wx.uploadFile({
          //http://localhost:8080/getCarLiencesInfo
          url: app.globalData.host + 'personLicence/upload',
          filePath: tempFilePaths[0],
          name: 'img',
          header: {
            "Content-Type": "multipart/form-data",
            'token': wx.getStorageSync('token')
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(data)
            if (data.httpStatus == 200) {
              wx.navigateTo({
                url: "/pages/jsResults/index?wzOrder=" + that.data.wzOrder + "&wzfk=" + that.data.wzfk + "&wzdate=" + that.data.wzdate + "&wzcity=" + that.data.wzcity + "&act=" + that.data.act+"&driverInfo=" + JSON.stringify(data.data) 
              })
              wx.hideLoading()
            } else if (data.httpStatus == 401) {
              wx.navigateTo({
                url: '../authorize/index',
              })
              wx.hideLoading()
            } else {
              wx.showModal({
                title: '错误提示',
                content: '扫描失败',
                showCancel: false,
                success: function (res) { }
              })
              wx.hideLoading()
            }
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
  radioChange: function(e){
    var self = this;
    console.log(e);
    self.setData({
      xsznumber:e.detail.value
    })
    // wx.showModal({
    //   title: '微信快捷支付',
    //   content: '￥200',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     }
    //   }
    // })
  },
  /**
   * 新增驾驶证
   */
  addInfo: function(){
   this.setData({
     condition:true
   })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})