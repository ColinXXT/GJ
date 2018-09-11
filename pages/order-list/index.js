var wxpay = require('../../utils/pay.js')
var app = getApp()
const orderList = [{
  id:'0',
  dateAdd:"2018-0-1",
  statusStr:"待处理",
  status:0,
  orderNumber:123456,
  remark:'代销违章',
  amountReal: 100,
}]
Page({
  data:{
    statusType: ["待处理", "处理中", "已完成"],
    currentType:0,
    tabClass: ["", "", ""]
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
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  toPayTap:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;
    wx.request({
      url: '',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.httpStatus == 0) {
            wxpay.pay(app, money, "/pages/order-list/index");     
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '支付失败',
            showCancel: false
          })
        }
      }
    })    
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
   
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
 
  },
  getOrderStatistics : function () {
    var that = this;
    console.log(1)
    
    wx.request({
      url: '',
      data: { token: wx.getStorageSync('token') },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          var tabClass = that.data.tabClass;
          if (res.data.data.count_id_no_pay > 0) {
            tabClass[0] = "red-dot"
          } else {
            tabClass[0] = ""
          }
          if (res.data.data.count_id_no_transfer > 0) {
            tabClass[1] = "red-dot"
          } else {
            tabClass[1] = ""
          }
          if (res.data.data.count_id_no_confirm > 0) {
            tabClass[2] = "red-dot"
          } else {
            tabClass[2] = ""
          }
          if (res.data.data.count_id_no_reputation > 0) {
            tabClass[3] = "red-dot"
          } else {
            tabClass[3] = ""
          }
          if (res.data.data.count_id_success > 0) {
            //tabClass[4] = "red-dot"
          } else {
            //tabClass[4] = ""
          }

          that.setData({
            tabClass: tabClass,
          });
        }
      }
    })
  },
  onShow:function(){
    // 获取订单列表
    //this.getOrderStatistics();
    this.setData({
      orderList: orderList
    });
    return;
    wx.showLoading();
    var that = this;
    var postData = {
      token: wx.getStorageSync('token')
    };
    postData.status = that.data.currentType;
    this.getOrderStatistics();
    wx.request({
      url: '',
      data: postData,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.setData({
            orderList: res.data.data.orderList
          });
        } else {
          this.setData({
            orderList: null
          });
        }
      }
    })
    
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
      phoneNumber: '400-888-9999', //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
})
