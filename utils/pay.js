var app = getApp();
function wzPay(app, money, productId, reqDate) {
  var orderNumber = app.globalData.orderNumber;
  console.log(orderNumber)
  wx.showLoading({
    title: '支付中...',
    mask: true
  })
  console.info(reqDate)
  wx.showToast({ title: '支付成功' })
  wx.redirectTo({
    url: '/pages/order-list/index?orderStatus=' + 1,
  })
wx.hideLoading()
}

function wxpayOrder(app, money, productId, orderNumber) {
  wx.showLoading({
    title: '支付中...',
    mask: true
  })
  wx.request({
    url: app.globalData.host + "/pay/getPayId?amount=" + money + "&productId=" + productId,
    method: "POST",
    data: {"orderNumber": orderNumber},
    header: {
      token: wx.getStorageSync('token'),
      "WL-Proxy-Client-IP": app.globalData.version
    },
    success: function (res) {
      console.log(res)
      if (res.data.httpStatus == 200) {
        // 发起支付
        console.log(res.data)
        wx.requestPayment({
          timeStamp: res.data.data.timestap,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.packageStr,
          signType: 'MD5',
          paySign: res.data.data.paySign,
          fail: function (res) {
            wx.showToast({
              title: '取消可再提交！',
              duration: 1500
            })
            wx.hideLoading()
          },
          success: function () {
            wx.showToast({ title: '支付成功' })
            wx.redirectTo({
              url: '/pages/order-list/index?orderStatus=' + 1,
            })
            wx.hideLoading()
          }
        })
      } else {
        wx.showToast({ title: '服务器忙' })
        wx.hideLoading()
      }
    }
  })
}
module.exports = {
  wzPay:wzPay,
  wxpayOrder:wxpayOrder
}
