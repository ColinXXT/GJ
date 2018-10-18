var app = getApp();

Page({
    data:{
      orderDetail:{},
      orderStatus:"",
      imgalist: []
    },
    onLoad:function(options){
      var that = this;
      
      var orderDetails = JSON.parse(options.orderDetails);
      var tempImageList = [];
      if (orderDetails.carLienceEntity && orderDetails.carLienceEntity.path){
        tempImageList.push(orderDetails.carLienceEntity.path)
      }
      if (orderDetails.personLienceEntity && orderDetails.personLienceEntity.path) {
        tempImageList.push(orderDetails.personLienceEntity.path)
      }
      
      that.setData({
        orderDetail: orderDetails,
        imgalist : tempImageList
      });   
      that.getStatusById(orderDetails.orderStatus); 
  },
    onShow : function () {},

    getStatusById: function (statusId){
      var self = this;
      switch (statusId) {
        case 0:
          self.setData({
            orderStatus:"未支付"
          })
          break;
        case 1:
          self.setData({
            orderStatus: "待处理"
          })
          break;
        case 2:
          self.setData({
            orderStatus: "处理中"
          })
          break;
        case 3:
          self.setData({
            orderStatus: "已完成"
          })
          break;
          default:
          self.setData({
            orderStatus: ""
          })
          break;
      }
    },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    console.log(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imgalist // 需要预览的图片http链接列表
    })
  }  
})