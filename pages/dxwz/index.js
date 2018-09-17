var app = getApp();
var wxpay = require('../../utils/pay.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productInfo: {},
    uploadimage:""  ,
    carLincenseList:{},
    condition:false,
    wzList:{},
    wzOrder: "",
    wzfk: "",
    act: "",
    wzcity: "",
    wzdate: "",
    code:"",
    fen:"",
    handled:"",
    archiveno:"",
    xsz: "",
    carNumber:'',
    carName:'',
    price:'',
    chepai:'',
    userIp: '',
    //手机号
    modalFlag: true,
    send: false,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    phoneNum: '',
    isRegPhone:'',
    path:"",
    lienceNumber:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var arrList = {
      "money": options.wzfk,
      "action": options.act,
      "area": options.wzcity,
      "date": options.wzdate,
      "code": options.code,
      "fen": options.fen,
      "handled": options.handled,
      "archiveno": options.archiveno
    };
      this.setData({
        wzList:arrList,
        wzOrder: options.wzOrder,
        wzfk: options.wzfk,
        act: options.act,
        wzcity: options.wzcity,
        wzdate: options.wzdate,
        chepai:app.globalData.chepai,
        code: options.code,
        fen: options.fen,
        handled: options.handled,
        archiveno: options.archiveno
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this;
    this.getPrice(); 
    this.getDriveList();  
    this.isPhoneRegisted();
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
          console.log(self.data.carLincenseList)
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

  submitOrder:function(e){
    var self = this;
    var money = e.currentTarget.dataset.money;
    var wzData = self.data.wzList;
    if (this.data.carNumber==""){
      wx.showToast({
        title: '请选择驾驶证',
        icon: "none"
      })
    }else{
      if (self.data.isRegPhone) {
        wxpay.wzPay(app, money, 1, "/pages/order-list/index", wzData);
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '为了给您更好的服务，请绑定手机号',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              self.setData({
                modalFlag: false
              })
            }
          }
        })
      }  
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
                url: "/pages/jsResults/index?wzOrder=" + that.data.wzOrder + "&wzfk=" + that.data.wzfk + "&wzdate=" + that.data.wzdate + "&wzcity=" + that.data.wzcity + "&act=" + that.data.act + "&code=" + that.data.code + "&fen=" + that.data.fen + "&handled=" + that.data.handled+ "&archiveno=" + that.data.archiveno+"&driverInfo=" + JSON.stringify(data.data) 
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
      carNumber: e.detail.value
    })
    app.globalData.lienceNumber = self.data.carNumber;
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
  // 手机号部分
  inputPhoneNum: function (e) {
    let phoneNum = e.detail.value
    if (phoneNum.length === 11) {
      let checkedNum = this.checkPhoneNum(phoneNum)
      if (checkedNum) {
        this.setData({
          phoneNum: phoneNum
        })
        console.log('phoneNum' + this.data.phoneNum)
        this.showSendMsg()
        this.activeButton()
      }
    } else {
      this.setData({
        phoneNum: ''
      })
      this.hideSendMsg()
    }
  },

  checkPhoneNum: function (phoneNum) {
    let str = /^1\d{10}$/
    if (str.test(phoneNum)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
        // image: '../../images/fail.png',
        icon: "none"
      })
      return false
    }
  },

  showSendMsg: function () {
    if (!this.data.alreadySend) {
      this.setData({
        send: true
      })
    }
  },

  hideSendMsg: function () {
    this.setData({
      send: false,
      disabled: true,
      buttonType: 'default'
    })
  },

  sendMsg: function () {
    wx.request({
      url: app.globalData.host + 'findPhone?telphone=' + this.data.phoneNum,
      //http://localhost:8080/findPhone?telphone={ telphone }
      header: {
        'token': wx.getStorageSync('token')
      },
      method: 'GET',
      success: function (res) {
        var res = JSON.parse(res.data);
        console.log(res)
        if (res.error_code == 0) {
          wx.showToast({
            title: "发送成功",
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: res.reason,
            icon: 'none'
          })
        }
      }, fail(res) {
        console.log(res)
        wx.showModal({
          title: '温馨提示',
          content: '发送失败，请重新绑定',
          showCancel: false
        })
      }
    })
    this.setData({
      alreadySend: true,
      send: false
    })
    this.timer()
  },

  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  // 验证码
  addCode: function (e) {
    this.setData({
      code: e.detail.value
    })
    this.activeButton()
    console.log('code' + this.data.code)
  },

  // 按钮
  activeButton: function () {
    let { phoneNum, code, otherInfo } = this.data
    if (phoneNum && code && otherInfo) {
      this.setData({
        disabled: false,
        buttonType: 'primary'
      })
    } else {
      this.setData({
        disabled: true,
        buttonType: 'default'
      })
    }
  },

  modalOk: function () {
    var that = this;
    console.log(app.globalData.host + 'validate/phone?code=' + this.data.code + '&telphone=' + this.data.phoneNum);
    wx.showLoading({
      title: '验证中',
    })
    wx.request({
      //http://localhost:8080//validate/phone?code={code}&telphone={ telphone }
      url: app.globalData.host + 'validate/phone?code=' + this.data.code + '&telphone=' + this.data.phoneNum,
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
          that.setData({
            isRegPhone:res.data.data
          })
          wx.hideLoading()
        } else if (res.data.httpStatus == 401) {
          wx.navigateTo({
            url: '../authorize/index',
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
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
      modalFlag: true,
    })
  },
  isPhoneRegisted: function () {
    var self = this;
    wx.request({
      url: app.globalData.host + 'isPhoneRegisted',
      method: 'GET',
      header: {
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res)
        if(res.data.httpStatus == 200){
          self.setData({
            isRegPhone:res.data.data
          })
        } else if (res.data.httpStatus == 401) {
          wx.navigateTo({
            url: '../authorize/index',
          })
        } 
      }, fail(res) {
        console.log(res)
      }
    })
  }
})