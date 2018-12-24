var wxpay = require('../../utils/pay.js')
const dealingOrder = [{
  address:"西安市车辆管理所总所",
  carLienceEntity : null,
  completeTime : "",
  name : "Colin",
  orderId : 29,
  orderNumber :"b1577c36f4124fc4899309e470b5c5e1",
  orderStatus:2,
  payTime:"",
  peccancyEntity:null,
  personLienceEntity:null,
  price:"0.01",
  resolveTime:"2018-11-13 16:58",
  timestamp: "2018-11-13 16:58:34",
  serverPeopleEntity:{
    bz:"",
    ip:"0:0:0:0:0:0:0:1",
    lastLogin:"2018-11-16 16:14:27",
    name:"colin",          password:"b6e048529a2f0694006ec56aba0aae0be166133d",
    peopleId:"b2b4a961cca04447b06fae3272bd5a92",
    phoneNumber:"13572106202",
    rights:"",
    roleId:"2",
    skin:"default",
    status:"0",
    userName:"Colin"
  },
  productEntity:
    { 
      price: 0.01, 
      productId: 6, 
      productName: "新车上牌（自行到现场）" 
    },
  customerInfoEntity:{
    city: "Xi'an", 
    gender: "1", 
    nickName: "Colin", 
    openId: "ouTco4xJihTx1gEU75yW3k1j16mk", 
    province: "Shaanxi", 
    telphoneNumber:"15594807003" 
    }
}]
const notPayOrder = []
var app = getApp()
Page({
  data:{
    statusType: ["未支付","待处理", "处理中", "已完成"],
    currentType:0,
    tabClass: ["", "", "red-dot",""]
  },
  statusTap:function(e){
     var curType =  e.currentTarget.dataset.index;
     this.data.currentType = curType
     this.setData({
       currentType:curType
     });
     this.onShow();
  },
  orderDetail : function (e) {
    console.log(e)
    var orderDetails = e.currentTarget.dataset.value;
    wx.navigateTo({
      url: "/pages/order-details/index?orderDetails=" + JSON.stringify(orderDetails)
    })
  },
  toPayTap:function(e){
    var that = this;
    var money = e.currentTarget.dataset.money;
    var productId = e.currentTarget.dataset.productid;
    console.log(e.currentTarget.dataset)
    var orderId = e.currentTarget.dataset.orderid;
    wxpay.wxpayOrder(app, money, productId, orderId);  
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载  
    if (options.orderStatus == 1){
      this.setData({
        currentType: 1
        })
    }else{
      this.setData({
        currentType: 0
      })
    }
    
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    app.globalData.orderNumber = "";
  },
  getOrderStatistics : function () {
    var that = this;
    
  },
  onShow:function(){
    var that = this;
    var tabClass = that.data.tabClass;
    wx.showLoading({
      title: '数据加载中',
      mask:true
    })
    var svsType = that.data.currentType;
    switch (svsType) {
      case 0 :
      case 1 :
      case 3 :
        that.setData({
          orderList: null
        })
        break;
      case 2:
        that.setData({
          orderList: dealingOrder
        })
        break
    }
    wx.hideLoading()
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
 
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
 
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
   
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  
  },
  /**
   * 电话联系客服
   */
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '029-88850320',
    })
  },
  toDelTap: function(e){
    console.log(e)
    var that = this;
    wx.showLoading({
      title: '删除数据中',
      mask: true
    })
    wx.request({
      url: app.globalData.host + '/order/deleleOrder?orderNumber=' + e.currentTarget.dataset.orderid,
      method: 'GET',
      header: {
        'token': wx.getStorageSync('token')
      },
      success: (res) => {
        console.log(res)
        if (res.data.httpStatus == 200) {
          that.onShow();
          wx.hideLoading();
        } else if (res.data.httpStatus == 401) {
          wx.navigateTo({
            url: '../authorize/index',
          })
          wx.hideLoading();
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '服务器不稳定,请重试',
            showCancel: false
          })
          wx.hideLoading();
        }

      }, fail :(res) => {
        console.log(res)
        wx.showModal({
          title: '错误提示',
          content: '网络异常，请重试',
          showCancel: false
        })
        wx.hideLoading();
      }
    })
  },
  completedOrder: function(e){
    console.log(e)
    var self = this;
    var orderId = e.currentTarget.dataset.oid;
    wx.showModal({
      title: '温馨提示',
      content: '确认完成该订单？',
      success: (res) => {
        wx.showLoading({
          title: '确认中...',
          mask:true
        })
        wx.request({
          url: app.globalData.host + '/order/changeOrderComplete?orderNumber=' + orderId,
          method: 'GET',
          header: {
            'token': wx.getStorageSync('token')
          },
          success: (res) => {
            console.log(res)
            if (res.data.httpStatus == 200) {
              self.onShow();
              wx.showToast({
                title: '确认成功！',
              })
              wx.hideLoading();
            } else if (res.data.httpStatus == 401) {
              wx.navigateTo({
                url: '../authorize/index',
              })
              wx.hideLoading();
            } else {
              wx.showModal({
                title: '温馨提示',
                content: '服务器不稳定,请重试',
                showCancel: false
              })
              wx.hideLoading();
            }

        }
      })
    }
  })
  }
})
