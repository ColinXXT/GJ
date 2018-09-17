var app = getApp();
const orderDetail = {
  handlerList : [{
    handlerName:"阿华",
    handlerPhone:"18819187898"
  }],
  driverList:[{
    carNumber:"陕A12345",
    carName:"小明",
    chejiaNumber:"ASD65321",
    chejiaName:"小花"
  }],
  wzlist:[{
    wzDate:"2017-8-8",
    wzAddr:"西安南二环",
    wzAct:"变更车道影响其他车辆行驶",
    wzkf:0,
    wzfk:60
  }],
  goods : [{
    orderId:12344555,
    productId: "不扣分代销违章",
    orderstatus:"处理中",
    dealOrderDate:"2018-1-1",
    yuyueDate:"2018-4-5",
    address: "高新区丈八四路",
    productPrice:120
  }],
}
 

Page({
    data:{
      orderId:1,
        goodsList:[],
        yunPrice:"0.00"
    },
    onLoad:function(e){
      var orderId = e.id;
      this.data.orderId = orderId;
      this.setData({
        orderId: orderId
      });
    },
    onShow : function () {
      var that = this;
      that.setData({
        orderDetail: orderDetail
      });
      console.log(this.data.orderDetail.handlerList.length)
      return;
    }
})