var app = getApp();
var tcity = require("../../utils/citys.js");
var validateCar = require("../../utils/validateCar.js");
var dateFormat = require("../../utils/util.js");
var wxpay = require('../../utils/pay.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: [],
    isShow: false,
    maskFlag: true,
    keyBoardType: 1,
    selected: "",
    selectedValue:"Y",
    carnumber: '请输入车牌号',
    dates: dateFormat.getNowTime(),
    nowTime: dateFormat.getNowTime(),
    time: dateFormat.formatTime(),
    cartube: "西安市车辆管理所总所",
    price: "？",
    ownerValue: "",
    getCarValue:"",
    addressValue: "",
    refereePhoneNum:"",
    items: [
      { name: 'Y', value: '是：车主自行驾车到车管所参与办理。', checked: 'true' },
      { name: 'N', value: '否：由温馨车管家司机代驾，上门取送车。' },
    ],
    cartubeArr: ["总所：西安市长安区郭杜北街49号", "郊县所：西安市未央区三桥西部车城内", "东区分所：东三环通塬路与金茂四路十字", "西区分所：西安市沣东新城西户路中段8号", "北区分所：渭水欣居南门向西50米", "南区分所：西安市东仪路19号"],
    transferServiceArr: ["-请选择服务类型-","行驶证补领", "车牌补领", "登记证补领"],
    transferServiceIndex: "0",
    transferService: "本市过户",
    imageUrl: "",
    cartubeIndex: 0,
    curIndex: 0,
    xszModel: true,
    xszModel1: true,
    djzModel: true,
    djzModel1: true,
    cpModel: true,
    cpModel1: true,
    cljyOrdyModel:true,
    cljyOrdyModel1:true,
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    //手机号
    phoneModalFlag: true,
    send: false,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    phoneNum: '',
    isRegPhone: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    console.log(cityData)
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
    console.log('初始化完成');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this;
    this.isPhoneRegisted();
    //this.getPrice();
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

  modalOk: function () {
    this.setData({
      xszModel: true,
      xszModel1: true,
      cpModel: true,
      cpModel1: true,
      djzModel: true,
      djzModel1: true,
      cljyOrdyModel1:true,
      cljyOrdyModel:true
    })
  },
  showRequireInfo: function (e) {
    var self = this;
    let val = self.data.transferServiceIndex;
    switch (val) {
      case "0":
        wx.showToast({
          title: '请选择对应服务',
          image: "../../images/more/error.png",
        })
        break;
      case "1":
        this.setData({
          xszModel: false
        })
        break;
      case "2":
        this.setData({
          cpModel: false
        })
        break;
      case "3":
        this.setData({
          djzModel: false
        })
        break;  
    }
  },
  showNotice: function (e) {
    var self = this;
    let val = self.data.transferServiceIndex;
    console.log(self.data.transferServiceIndex)
    switch (val) {
      case "0":
        wx.showToast({
          title: '请选择对应服务',
          image: "../../images/more/error.png",
        })
        break;
      case "1":
        self.setData({
          xszModel1: false
        })
        break;
      case "2":
        this.setData({
          cpModel1: false
        })
        break;
      case "3":
        this.setData({
          djzModel1: false
        })
        break;
    }
  },
  /**
   * 监听车牌键盘输入动作
   */
  inputChange: function (e) {
    console.log("input behavior")

    if (e.detail) {
      this.setData({
        keyBoardType: 2,
      })
    }
    let province = e.detail;
    let carnumber = this.data.carnumber.replace('请输入车牌号', '');
    this.setData({
      carnumber: carnumber + province,
    })
    console.log(this.data.carnumber);
  },
  /**
   * 监听车牌键盘删除动作
   */
  inputdelete: function () {
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
      keyBoardType: 2
    })
  },
  /**
   * 监听单选框
   */
  radioChange: function (e) {
    var self = this;
    if (e.detail.value == "Y") {
      self.setData({
        selectedValue:"Y",
        addressValue:""
      })
      self.getPrice();
    } else if (e.detail.value == "N") {
      self.setData({
        selectedValue: "N",
        addressValue:""
      })
      self.getPrice();
    }
  },
  inputlinsener: function (e) {
    console.log(e)
    let val = e.target.dataset.id;
    switch (val) {
      case 'owner':
        this.setData({
          ownerValue: e.detail.value
        })
        break;
      case 'address':
        this.setData({
          addressValue: e.detail.value
        })
      case 'getCar':
        this.setData({
          getCarValue: e.detail.value
        })     
        break;
    }
  },
  /**
   * 提交订单带推荐人
   * 
   */
  submitOrderWithReferee : function(e){
    var self = this;
    if (self.data.refereePhoneNum =="")return self.submitOrder(e);
    self.validateRefereePhoneNum(e);
  },
  /**
   * 提交订单 
   */
  submitOrder: function (e) {
    console.log(e)
    var money = e.target.dataset.money;
    var self = this;
    // if (!validateCar.validateCar(this.data.carnumber)) return;
    if(self.data.transferServiceIndex==0){
      wx.showModal({
        title: '温馨提示',
        content: "请选择服务类型"
      })
      return;
    }
    if (this.data.ownerValue == "") {
      wx.showModal({
        title: '温馨提示',
        content: "联系人姓名不能为空"
      })
      return;
    }
    if (this.data.carnumber == "") {
      wx.showModal({
        title: '温馨提示',
        content: "车牌号不能为空"
      })
      return;
    }
      if (self.data.selectedValue=="N" && self.data.addressValue == "") {
      wx.showModal({
        title: '温馨提示',
        content: "接车地址不能为空"
      })
      return;
    }
    if (self.data.transferServiceIndex==2 && self.data.getCarValue == "") {
      wx.showModal({
        title: '温馨提示',
        content: "取证地址不能为空"
      })
      return;
    }
    var subDriArr = {
      
      "name": self.data.ownerValue,
      "price": money,
      "resolveTime": self.data.dates + " " + self.data.time,
      "address": self.data.selectedValue == "Y" ? self.data.cartube :self.data.province + self.data.city + self.data.county + self.data.addressValue,
      "inviteTelphone": self.data.refereePhoneNum
    };
   // if (self.data.transferServiceIndex == 1) delete subDriArr.address
    if (self.data.transferServiceIndex == 2) subDriArr.address = self.data.province + self.data.city + self.data.county+ self.data.getCarValue;
    console.log(subDriArr)

    if(self.data.isRegPhone!=null){
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
  bindApoDateChange: function (e) {
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
  bindCartubeChange: function (e) {
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
      addressValue: ""
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
  keyBoard: function () {
    this.setData({
      isShow: !this.data.isShow,
      maskFlag: false
    })
  },
  keyInputDone: function () {
    this.setData({
      isShow: !this.data.isShow,
      maskFlag: true
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
    that.setData({
      phoneModalFlag: true,
      isRegPhone: "12312"
    })
    wx.showToast({
      title: '验证成功，请提交订单',
      icon: 'success'
    })
    wx.hideLoading()
   
  },
  getPrice: function () {
    var self = this;
    var svsType = self.data.transferServiceIndex;
    if (svsType == "0") {
      self.setData({
        price: "0.00"
      });
      return;
    }
    var radioType = self.data.selectedValue;
    console.log(radioType)
    switch (svsType) {
      case "1":
        if (radioType=="Y"){
          self.setData({
            selected:"11"
          });
        }else{
          self.setData({
            selected: "12"
          });
        }
        break;
      case "2":
        if (radioType == "Y") {
          self.setData({
            selected: "13"
          });
        } else {
          self.setData({
            selected: "14"
          });
        }
      break;
      case "3":   
          self.setData({
            selected: "15"
          });
        break;
    }
    self.setData({
      price: 100
    })
    
  },
  move: function () { },
  // 手机号部分
  inputRefereePhoneNum: function (e) {
    this.setData({
      refereePhoneNum: e.detail.value
    })
  },
  validateRefereePhoneNum: function (e) {
    var self = this;
    if (!self.checkPhoneNum(self.data.refereePhoneNum))
      return;
    wx.showLoading({
      title: '推荐人检测中...'
    })
    wx.request({
      url: app.globalData.host + '/findByPhone?phone=' + self.data.refereePhoneNum,
      method: 'GET',
      header: {
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res)
        if (res.data.data.telphoneNumber){
          self.submitOrder(e)
          wx.hideLoading()
        } else {
          wx.showToast({
            title: '推荐人号码无效',
            icon: "none"
          })
          wx.hideLoading()
        }
      }
    })
  },
  bindTransferSvsChange: function (e) {
    var self = this;
  
    console.log(e)
    self.setData({
      selectedValue : "Y",
      ownerValue:"",
      addressValue:"",
      getCarValue:"",
      items: [
        { name: 'Y', value: '是：车主自行驾车到车管所参与办理。', checked: 'true' },
        { name: 'N', value: '否：由温馨车管家司机代驾，上门取送车。' },
      ],
      transferServiceIndex: e.detail.value,
      transferService: self.data.transferServiceArr[e.detail.value]
    })
    self.getPrice();
  }
})