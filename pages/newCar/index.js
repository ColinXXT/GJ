var app = getApp();
var tcity = require("../../utils/citys.js");
var wxpay = require('../../utils/pay.js');
var dateFormat = require("../../utils/util.js");
var list = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaIndex: 0,
    selected:"6",
    selectedValue:"Y",
    dates: dateFormat.getNowTime(),
    nowTime: dateFormat.getNowTime(),
    time: dateFormat.formatTime(),
    cartube:"西安市车辆管理所总所",
    price: "0",
    licenceIndex: 0,
    contactValue:"",
    addressValue:"",
    second:0,
    items: [
      { name: 'Y', value: '是：车主自行驾车到车管所参与办理。', checked: 'true' },
      { name: 'N', value: '否：由温馨车管家司机代驾，上门取送车。' },
    ],
    cartubeArr: ["总所：西安市长安区郭杜北街49号", "郊县所：西安市未央区三桥西部车城内", "东区分所：东三环通塬路与金茂四路十字", "西区分所：西安市沣东新城西户路中段8号", "北区分所：渭水欣居南门向西50米", "南区分所：西安市东仪路19号"],
    cartubeIndex: 0,
    modalFlag: true,
    modalFlag1:true,
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    isRegPhone:"",
    phoneModalFlag:true,
    multiIndex: [0, 0],
    multiArray:[],
    objectMultiArray:{},
    maskFlag: true,
    remind:"加载中"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    tcity.init(that); 
    var cityData = that.data.cityData;
    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
    console.log(citys)
    console.log('初始化完成');
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this;
      self.getPrice();
      self.isPhoneRegisted();
    app.globalData.orderNumber = "";
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

  bindPickerChange: function (e) {
    this.setData({
      areaIndex: e.detail.value
    })
  },
  bindLicenceChange:function(e){
    this.setData({
      licenceIndex: e.detail.value
    })
  },
  modalOk: function(){
    this.setData({
      modalFlag: true,
      modalFlag1:true,
    })
  },
  showRequireInfo: function(e){
    var self = this;
        self.setData({
          modalFlag: false
        })
    },
  showNotice: function(e){
    var self = this;
    self.setData({
      modalFlag1: false
    })
  },
  /**
   * 监听车牌键盘输入动作
   */
  inputChange:function(e){
    console.log("input behavior")

    if(e.detail){
      this.setData({
        keyBoardType: 2,
      })
    }
    let province = e.detail;
    let carnumber = this.data.carnumber.replace('请输入车牌号','');
    this.setData({
      carnumber: carnumber + province,
    })
    console.log(this.data.carnumber);
  },
  /**
   * 监听车牌键盘删除动作
   */
  inputdelete:function(){
    console.log("delect")
    let carnumber = this.data.carnumber;
    var arr = carnumber.split('');
    arr.splice(-1, 1)
    console.log(arr)
    var str = arr.join('')
    if (str == '') {
      this.setData({
        keyBoardType: 1
      })
    }
    this.setData({
      carnumber: str
    })
  },
  backKeyboard() {//返回省份键盘
    this.setData({
      keyBoardType:2
    })
  },
  /**
   * 监听单选框
   */
  radioChange: function (e) {
    var self = this;
    if (e.detail.value == "Y") {
      self.setData({
        selected: "6",
        selectedValue:"Y",
        addressValue: ""
      })
      self.getPrice();
    } else if (e.detail.value == "N"){
      self.setData({
        selected: "7",
        selectedValue: "N",
        addressValue:""
      })
      self.getPrice();
    }
  },

  inputlinsener:function(e){
    console.log(e)
    let val = e.target.dataset.id;
    switch (val) {
      case 'contactPoint':
        this.setData({
          contactValue: e.detail.value
        })
        break;
      case 'address':
        this.setData({
          addressValue: e.detail.value
        })
        break;
      }
  },
  /**
   * 提交订单 
   */
  submitOrder:function(e){
    var money = e.target.dataset.money;
    var self = this;
    if (self.data.contactValue == "") {
        wx.showModal({
          title: '温馨提示',
          content: "联系人姓名不能为空"
        })
        return;
      }
      if (self.data.selectedValue=="N" && self.data.addressValue == "") {
        wx.showModal({
          title: '温馨提示',
          content: "地址不能为空"
        })
        return;
      }
    var subDriArr = {
      "name": self.data.contactValue,
      "price": money,
      "resolveTime": self.data.dates +' '+self.data.time,
      "address": self.data.selectedValue == "Y" ? self.data.cartube :self.data.province + self.data.city + self.data.county + self.data.addressValue
  };
    console.log(subDriArr)
    if(self.data.isRegPhone){
      wx.showModal({
        title: '',
        content: '确认订单？',
        success: function (res) {
          if (res.confirm) {
            wxpay.wzPay(app, money, self.data.selected, subDriArr);
          }
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '为了给您更好的服务，请绑定手机号',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            self.setData({
              phoneModalFlag: false
            })
          }
        }
      })
    }
  },

  /**
   * 监听日期 - picker
   */
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  /**
   * 监听日期 - picker
   */
  bindTimeChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  /**
   * 监听车管所 - picker
   */
  bindCartubeChange: function (e){
    console.log(e)
    this.setData({
      cartubeIndex: e.detail.value,
      cartube: this.data.cartubeArr[e.detail.value]
    })
  },
   /**
   * 监听省市区三级联动键盘
   */
  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;
    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }
  },
   /**
   * 监听省市区三级联动键盘
   */
  open: function () {
    this.setData({
      condition: !this.data.condition,
      maskFlag: false,
      addressValue:""
    })
  },
  open1: function () {
    this.setData({
      condition: !this.data.condition,
      maskFlag: true,
    })
  },
  /**
   * 监听车牌键盘
   */
  keyBoard:function(){
    this.setData({
      isShow: !this.data.isShow
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
        image: "../../images/more/error.png",
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
      url: app.globalData.host + '/findPhone?telphone=' + this.data.phoneNum,
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
            image: "../../images/more/error.png",
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
  phoneModalOk: function () {
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
          that.setData({
            phoneModalFlag: true
          })
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
            title: res.data.msg,
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
          showCancel: false,

        })
        wx.hideLoading()
      }
    })
  },
  phoneModalCancel: function () {
    this.setData({
      phoneModalFlag: true
    })
  },
  isPhoneRegisted: function () {
    var self = this;
    wx.request({
      url: app.globalData.host + '/isPhoneRegisted',
      method: 'GET',
      header: {
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res)
        self.setData({
          isRegPhone: res.data.data
        })
      }, fail(res) {
        console.log(res)
      }
    })
  },
  getPrice: function () {
    var self = this;
    wx.request({
      url: app.globalData.host + '/product/gerPrice?productId=' + self.data.selected,
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

        } else if (res.data.httpStatus == 401) {
          wx.navigateTo({
            url: '../authorize/index',
          })
 
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '服务器不稳定，获取价格失败，请重试',
            showCancel: false,
            success: function () {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          })
        } 
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
  move: function () {}
})