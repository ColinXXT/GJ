const app = getApp()

Page({
	data: {
    mobile:"",
    modalFlag:true,
    send: false,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    phoneNum: ''
  },
	onLoad() {
    
	},	
  onShow() {
    console.log("show")
    let that = this;
    let userInfo = wx.getStorageSync('userInfo')
    that.setData({
      userInfo: userInfo,
    })
  },
  
  bindGetUserInfo: function (e) {
    console.log(e)
    if (!e.detail.userInfo) {
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.login();
  },
  login: function () {
    let that = this;
    wx.showLoading({
      title: '登录中',
    })
    wx.login({
      success: function (res) {
        console.log(res)
        wx.request({
          url: app.globalData.host+'auth?jsCode=' + res.code,
          method: "POST",
          data: {
            nickName: wx.getStorageSync("userInfo").nickName,
            gender: wx.getStorageSync("userInfo").gender,
            province: wx.getStorageSync("userInfo").province,
            city: wx.getStorageSync("userInfo").city
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.httpStatus == 200) {
              wx.setStorageSync('token', res.data.data)
              console.log(wx.getStorageSync('token'))
              that.isPhoneRegisted();
              that.setData({
                userInfo: wx.getStorageSync("userInfo")
              })
              wx.hideLoading()    
            } else if (res.data.httpStatus == 401) {
              wx.navigateTo({
                url: '../authorize/index',
              })
              wx.hideLoading()    
            } else {
              // 登录错误
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              wx.hideLoading();
            }
          },
          fail: function (res) {
            console.log(res)
            wx.showModal({
              title: '提示',
              content: '授权失败，请重试',
              showCancel: false
            })
            wx.hideLoading();
          }
        })
      }
    })
  },
  isPhoneRegisted:function(){
    var self = this;
    wx.request({
      url: app.globalData.host + 'isPhoneRegisted',
      method: 'GET',
      header: {
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res)
        //false 没有注册过手机号
        if (res.data.data!="") {
          return;
        } else {
          self.setData({
            modalFlag: false
          })
        }
      }, fail(res) {
        console.log(res)
      }
    })
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
        icon:"none"
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
        if (res.error_code==0){
            wx.showToast({
              title: "发送成功",
              icon: 'success'
            })
          }else {
          wx.showToast({
            title: res.reason,
            icon: 'none'
          })
        }
      },fail(res){
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
          wx.hideLoading()    
        } else if(res.data.httpStatus == 401) {
          wx.navigateTo({
            url: '../authorize/index',
          })
          wx.hideLoading()    
        } else {
          wx.showToast({
            title: res.data.data,
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
  modalCancel: function(){
    this.setData({
      modalFlag:true
    })
  },
  gotoOrder:function(e){
    console.log(e.target.dataset.id)
    console.log(wx.getStorageSync('token'))
    if (wx.getStorageSync('userInfo') == "") {
      wx.showModal({
        title: '温馨提示',
        content: '为了给您提供更贴心但服务，请先登录',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/index',
            })
          }
        }
      })
      return;
    }else if (wx.getStorageSync('token') == "") {
      wx.showModal({
        title: '温馨提示',
        content: '为了给您提供更贴心但服务，请先授权',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../authorize/index',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    };
    wx.navigateTo({
      url: '../order-list/index?vid=' + e.target.dataset
        .id,
    })
  }
})