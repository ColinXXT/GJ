var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadimage:"" ,
    condition:false,
    driverLists:{},
    results:[],
    wxDetails:{},
    remind: '加载中'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
            },1000)
          };
          setTimeout(function () {
            self.setData({
              remind: ''
            });
          }, 1000);
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
          mask: true
        })
          wx.uploadFile({
            url: app.globalData.host + '/getCarLiencesInfo',
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
    self.setData({
      results: e.detail.value.split(",")
    })
    var result = self.data.results;
    wx.showLoading({
      title: '查询中...',
      mask: true
    })
    wx.request({
      url: app.globalData.host + '/saveCarLience',
      data: {
        "carNumber": result[0],
        "carType": result[1],
        "cjNumber": result[2],
        "fdjh": result[3],
        "owner": result[4],
        "path":result[5],
        "registedDate":result[6]
      },
      header: {
        'token': wx.getStorageSync('token')
      },
      method: "POST",
      success: function (res) {
        var res = res;
        console.log("response", res);
        if (res.data.httpStatus == 200) {
          self.setData({
            wxDetails: res.data.data
          })
          wx.redirectTo({
            url: "/pages/wzlist/index?wxDetails=" + self.data.wxDetails + "&driverLists=" + self.data.driverLists + '&chepai=' + result[0]
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
            image: "../../images/more/error.png",
          })
          wx.hideLoading()
        }
      }, fail(res) {
        console.log(res)
        wx.showToast({
          title: '网络异常，请重试',
          image: "../../images/more/error.png",
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
  
  },
  modalOk: function () {
    var that = this;
    wx.showLoading({
      title: '验证中',
      mask: true
    })
    wx.request({
      url: app.globalData.host + '/validate/phone?code=' + this.data.code + '&telphone=' + this.data.phoneNum,
      header: {
        'token': wx.getStorageSync('token')
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.httpStatus == 200) {
          setTimeout(function () {
            that.setData({
              modalFlag: true
            })
          }, 2000)
          wx.showToast({
            title: '验证成功',
            icon: 'success'
          })
          wx.hideLoading()
        } else if (res.data.httpStatus == 401) {
          wx.navigateTo({
            url: '../authorize/index',
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.data,
            image: "../../images/more/error.png",
          })
          wx.hideLoading()
        }
      },
      fail: function (res) {
        console.log(res)
        wx.showModal({
          title: '温馨提示',
          content: '验证失败，请重新绑定',
          showCancel: false
        })
        wx.hideLoading()
      }
    })
  },
  modalCancel: function () {
    this.setData({
      modalFlag: true
    })
  },
  bindtap1: function (e) {
    var self = this;
    var result = this.data.results;
    var wxDetails = this.data.wxDetails;
    console.log()
    if (JSON.stringify(wxDetails) != "{}"){
     wx.navigateTo({
        url: "/pages/wzlist/index?wxDetails=" + wxDetails + "&driverLists=" + self.data.driverLists + '&chepai=' + result[0]
      })
    }  
  }
})