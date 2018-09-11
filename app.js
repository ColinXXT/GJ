//app.js
App({
  onLaunch: function () {
    var that = this;    
    // // 判断是否登录
    // let token = wx.getStorageSync('token');
    // if (!token) {
    //   that.goLoginPageTimeOut()
    //   return
    // }
  },
  sendTempleMsg: function (orderId, trigger, template_id, form_id, page, postJsonString){
    var that = this;
    wx.request({
      url: '',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: wx.getStorageSync('token'),
        type:0,
        module:'order',
        business_id: orderId,
        trigger: trigger,
        template_id: template_id,
        form_id: form_id,
        url:page,
        postJsonString: postJsonString
      },
      success: (res) => {
        //console.log('*********************');
        //console.log(res.data);
        //console.log('*********************');
      }
    })
  },
  globalData:{
    userInfo:null,
    host:"https://www.wxcheguanjia.com/",
    subDomain: "", // 如果你的域名是： 
    version: "3.0.1",
    chepai:"",
    chejia:""
  }
})  
