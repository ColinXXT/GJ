var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadimage:"" ,
    condition:false,
    driverLists:{}
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
    console.log(app.globalData.host + 'findAllCar')
    console.log(wx.getStorageSync('token')) 
    
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: app.globalData.host + 'findAllCar',
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
            },1000)
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
            url: app.globalData.host + 'getCarLiencesInfo',
            filePath: tempFilePaths[0],
            name: 'image',
            header: { 
              "Content-Type": "multipart/form-data" ,
              'token': wx.getStorageSync('token')
              },
            success: function (res) {
              var data = JSON.parse(res.data);
              console.log(data)
              if(data.httpStatus==200){
                wx.navigateTo({
                  url: "/pages/xszResults/index?driverInfo=" + JSON.stringify(data.data)
                  })
                wx.hideLoading()    
              }else if(data.httpStatus==401){
                wx.navigateTo({
                  url: '../authorize/index',
                })
                wx.hideLoading()    
              } else{
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
    var result = e.detail.value.split(",");
    wx.showLoading({
      title: '查询中...',
    })
    wx.request({
      url: app.globalData.host + 'saveCarLience',
      data: {
        "carNumber": result[0],
        "carType": result[1],
        "cjNumber": result[2],
        "fdjh": result[3],
        "owner": result[4]
      },
      header: {
        'token': wx.getStorageSync('token')
      },
      method: "POST",
      success: function (res) {
        var res = res;
        console.log("response", res);
        if (res.data.httpStatus == 200) {
          wx.navigateTo({
            url: "/pages/wzlist/index?wxDetails=" + res.data.data + "&driverLists=" + self.data.driverLists + '&chepai=' + result[0] + '&chejia=' + result[2]
          })
          wx.hideLoading()
        } else if (res.data.httpStatus == 401) {
          wx.navigateTo({
            url: '../authorize/index',
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: '网络异常，请重试',
            icon: "none"
          })
          wx.hideLoading()
        }
      }, fail(res) {
        console.log(res)
        wx.showToast({
          title: '网络异常，请重试',
          icon: "none"
        })
        wx.hideLoading()
      }
    })
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