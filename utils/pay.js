function wxpay(app, money, redirectUrl) {
  wx.request({
    url: app.globalData.host + 'pay',
    data: {
      money:money,
      prepay_id:0
    },
    header:{
      token: wx.getStorageSync('token'),
    },
    method:'POST',
    success: function(res){
      if(res.data.httpStatus == 200){
        // 发起支付
        wx.requestPayment({
          timeStamp:res.data.data.timeStamp,
          nonceStr:res.data.data.nonceStr,
          package:'prepay_id=' + res.data.data.prepayId,
          signType:'MD5',
          paySign:res.data.data.sign,
          fail:function (res) {
            wx.showToast({title: '支付失败:' + res})
          },
          success:function () {
            wx.showToast({title: '支付成功'})
            wx.redirectTo({
              url: redirectUrl
            });
          }
        })
      } else {
        wx.showToast({ title: '服务器忙' + res.data.httpStatus + res.data.msg})
      }
    }
  })
}

module.exports = {
  wxpay: wxpay
}
