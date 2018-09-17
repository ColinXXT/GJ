//app.js
App({
  onLaunch: function () {
    var that = this;    
    wx.request({
      url: 'http://ip-api.com/json',
      success: function (e) {
        console.log(e.data.query)
          wx.setStorageSync('userIp',e.data.query)
        }
    })      
  },
  
  globalData:{
    userInfo:null,
    host:"https://www.wxcheguanjia.com/",
    //host:"http://192.168.1.10:8080/",
    subDomain: "", // 如果你的域名是： 
    version: "3.0.1",
    chepai:"",
    lienceNumber:""
  }
})  
