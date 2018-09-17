function wxpay(app, money, productId, redirectUrl, wzData, driverData) {
  console.log(money+'\n+'+productId)
  console.log(wzData)
  console.log(driverData)
  var url = app.globalData.host + "pay/getPayId?amount=" + money + "&productId=" + productId;
  console.log("Pay url===="+url)
  console.log("userIp====="+wx.getStorageSync("userIp"))
  console.log("token======="+wx.getStorageSync("token"))
  var reqDate = {}; 
  if (driverData){
    reqDate = {
      "personLienceNumber": app.globalData.lienceNumber,
      "carNumber": app.globalData.chepai,
      "resolveTime": driverData.resolveTime,
      "address": driverData.address,
      "price": money,
      "peccancyEntity": wzData
    }
  }else{
    reqDate = {
      "personLienceNumber": app.globalData.lienceNumber,
      "carNumber": app.globalData.chepai,
      "price": money,
      "peccancyEntity": wzData
    }
  }
  console.log(reqDate)
  wx.showLoading({
    title: '支付中...',
  })
  wx.request({
    url: app.globalData.host + "pay/getPayId?amount=" + money + "&productId=" + productId,
    method: "POST",
    data: reqDate,
    header: {
      token: wx.getStorageSync('token'),
      "WL-Proxy-Client-IP":wx.getStorageSync("userIp")
    },
    success: function(res){
      console.log(res)
      if(res.data.httpStatus == 200){
        // 发起支付
        console.log(res.data)
        wx.requestPayment({
          timeStamp: res.data.data.timestap,
          nonceStr:res.data.data.nonceStr,
          package: res.data.data.packageStr,
          signType:'MD5',
          paySign: res.data.data.paySign,
          fail:function (res) {
            wx.showToast({title: '支付失败:' + res})
            wx.hideLoading()
          },
          success:function () {
            wx.showToast({title: '支付成功'})
            wx.redirectTo({
              url: redirectUrl
            });
            wx.hideLoading()
          }
        })
      } else {
        wx.showToast({ title: '服务器忙' + res.data.httpStatus + res.data.msg})
        wx.hideLoading()
      }
    }
  })
}

function wzPay(app, money, productId, redirectUrl, wzData) {
  console.log(money + '\n+' + productId)
  console.log(wzData)
  var url = app.globalData.host + "pay/getPayId?amount=" + money + "&productId=" + productId;
  console.log("Pay url====" + url)
  console.log("userIp=====" + wx.getStorageSync("userIp"))
  console.log("token=======" + wx.getStorageSync("token"))
  var reqDate = {};
    reqDate = {
      "personLienceNumber": app.globalData.lienceNumber,
      "carNumber": app.globalData.chepai,
      "price": money,
      "peccancyEntity": wzData
  }
  console.log(reqDate)
  wx.showLoading({
    title: '支付中...',
  })
  wx.request({
    url: app.globalData.host + "pay/getPayId?amount=" + money + "&productId=" + productId,
    method: "POST",
    data: reqDate,
    header: {
      token: wx.getStorageSync('token'),
      "WL-Proxy-Client-IP": wx.getStorageSync("userIp")
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
            wx.showToast({ title: '支付失败:' + res })
            wx.hideLoading()
          },
          success: function () {
            wx.showToast({ title: '支付成功' })
            wx.redirectTo({
              url: redirectUrl
            });
            wx.hideLoading()
          }
        })
      } else {
        wx.showToast({ title: '服务器忙' + res.data.httpStatus + res.data.msg })
        wx.hideLoading()
      }
    }
  })
}

function wxpayOrder(app, money, productId, redirectUrl) {
  console.log(money + '\n+' + productId)
  console.log("userIp=====" + wx.getStorageSync("userIp"))
  console.log("token=======" + wx.getStorageSync("token"))
  var reqDate = {};
  console.log(reqDate)
  wx.showLoading({
    title: '支付中...',
  })
  wx.request({
    url: app.globalData.host + "pay/getPayId?amount=" + money + "&productId=" + productId,
    method: "POST",
    data: reqDate,
    header: {
      token: wx.getStorageSync('token'),
      "WL-Proxy-Client-IP": wx.getStorageSync("userIp")
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
            wx.showToast({ title: '支付失败:' + res })
            wx.hideLoading()
          },
          success: function () {
            wx.showToast({ title: '支付成功' })
            wx.redirectTo({
              url: redirectUrl
            });
            wx.hideLoading()
          }
        })
      } else {
        wx.showToast({ title: '服务器忙' + res.data.httpStatus + res.data.msg })
        wx.hideLoading()
      }
    }
  })
}
module.exports = {
  wxpay: wxpay,
  wzPay:wzPay,
  wxpayOrder:wxpayOrder
}
