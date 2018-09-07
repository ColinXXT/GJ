var app = getApp();
var validateCar = require("../../utils/validateCar.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: [],
    condition:true,
    areaIndex: 0,
    uploadimage:null,
    imageUrl:"",
    curIndex: 0,
    isScroll: false,
    modalFlag: true,
    modalFlag1:true,
    modalFlag2:true,
    chepaiValue:"",
    fadongjiValue:'',
    chejiaValue:'',
    uploadimage: "",
    carTypesValue:"",
    ownerValue:"",
    registedDate: "2018-1-1"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = JSON.parse(options.driverInfo);
    console.log(data)
    this.setData({
      carTypesValue: data.carType,
      chepaiValue: data.carNumber,
      fadongjiValue: data.fdjh,
      chejiaValue: data.cjNumber,
      registedDate: data.registedDate,
      ownerValue:data.owner
    })
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
   * 监听model
   */
  modalOk: function(){
    this.setData({
      modalFlag: true,
      modalFlag1:true,
      modalFlag2:true
    })
  },

  /**
   * 监听model
   */
  showItem: function(e){
    var self = this;
        self.setData({
          modalFlag: false
        })
    },
  showMechie: function(e){
    var self = this;
    self.setData({
      modalFlag1: false
    })
  },
  showCheJiaNumber: function (e) {
    var self = this;
      self.setData({
        modalFlag2: false
      })
  },

  /**
   * 监听键盘输入事件
   */
  carInput:function(e){
    let val = e.target.dataset.id;
    console.log(e)
    switch (val) {
      case 'carNumber':
        this.setData({
          chepaiValue: e.detail.value
        })
        break;
      case 'fdjNumber':
        this.setData({
          fadongjiValue: e.detail.value
        })
        break;
      case 'zjNumber':
        this.setData({
          chejiaValue: e.detail.value
        })
        break;
      case 'carTypes':
        this.setData({
          carTypesValue: e.detail.value
        })    
        break;
      case 'owner':
        this.setData({
          ownerValue: e.detail.value
        })
        break;  
    }
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
   * 查询事件
   */
  save:function(){
    var self = this;
    if (!validateCar.validateCar(this.data.chepaiValue)) return;
    if (this.data.chepaiValue=="") {
      wx.showModal({
        title: '温馨提示',
        content: "车牌号不能为空"
      })
      return;
    }
    if (this.data.ownerValue == "") {
      wx.showModal({
        title: '温馨提示',
        content: "车主姓名不能为空"
      })
      return;
    }
    if (this.data.chejiaValue == "") {
      wx.showModal({
        title: '温馨提示',
        content: "车架号不能为空"
      })
      return;
    }
    if (this.data.fadongjiValue == "") {
      wx.showModal({
        title: '温馨提示',
        content: "发动机号不能为空"
      })
      return;
    }
    if (this.data.carTypesValue == "") {
      wx.showModal({
        title: '温馨提示',
        content: "车型不能为空"
      })
      return;
    }
    
    wx.showModal({
      title: '温馨提示',
      content: '确定扫描结果无误后查询！',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '查询中',
          })
          wx.request({
            url: app.globalData.host + 'saveCarLience',
            data: {
              "carNumber": self.data.chepaiValue,
              "carType": self.data.carTypesValue,
              "cjNumber": self.data.chejiaValue,
              "fdjh": self.data.fadongjiValue,
              "owner": self.data.owner
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
                  url: "/pages/wzlist/index?wxDetails=" + res.data.data
                })
              } else if (res.data.httpStatus == 401){
                wx.navigateTo({
                  url: '../authorize/index',
                })
              }else{
                wx.showToast({
                  title: '查询失败',
                  icon:"none"
                })
              }
              wx.hideLoading()
            },fail(res){
              wx.showModal({
                title: '温馨提示',
                content: '请求超时，请重新选择服务项目',
              })
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 监听日期 - picker
   */
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      registedDate: e.detail.value
    })
  }
})