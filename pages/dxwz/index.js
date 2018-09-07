var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productInfo: {},
    uploadimage:""  ,
    carLincenseList:[],
    condition:false,
    wzOrder: "",
    wzfk: "",
    act: "",
    wzcity: "",
    wzdate: "",
    xsz: "",
    xsznumber:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
      this.setData({
        wzOrder: options.wzOrder,
        wzfk: options.wzfk,
        act: options.act,
        wzcity: options.wzcity,
        wzdate: options.wzdate,
        xsz: options.xsz
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("getSvsList Api")
    // wx.setNavigationBarTitle({
    //   title: "已录入／新增行驶证查违章"//页面标题为路由参数
    // }) 
    // this.setData({
    //   carLincenseList:[
    //     { id: '1', value: 'JZ00000' },
    //     { id: '2', value: 'JZ00001' }
    //   ]

    // }) 
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

  submitOrder:function(){
    if(this.data.xsznumber!=""){
      wx.showToast({
        title: '下单成功',
      })
    }else{
      wx.showToast({
        title: '请选择驾驶证',
        icon:"none"
      })
    }
  },
  /**
   * 图片获取跟上传
   */  
  bindChooseImage: function () {
    var that = this;

    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        wx.navigateTo({
          url: "/pages/jsResults/index?type=jsz&uploadimage=" + tempFilePaths[0] + "&wzOrder=" + that.data.wzOrder + "&wzfk=" + that.data.wzfk + "&xsz=" + that.data.xsz + "&wzdate=" + that.data.wzdate + "&wzcity=" + that.data.wzcity + "&act=" + that.data.act        
          })
    
      return
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++)         {
          wx.uploadFile({
            url: '',
            filePath: tempFilePaths[i],
            name: 'uploadfile_ant',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              var data = JSON.parse(res.data);
              //服务器返回格式: { "chejiaValue":"0000", chepaiValue": "0000", "fadongjiValue": "00000", "Url": "https://test.com/1.jpg" }
              var productInfo = that.data.productInfo;
              if (productInfo.bannerInfo == null) {
                productInfo.bannerInfo = [];
              }
              productInfo.bannerInfo.push({
                "chejiaValue": data.chejiaValue,
                "chepaiValue": data.chepaiValue,
                "fadongjiValue": data.fadongjiValue,
                "url": data.Url
              });
              that.setData({
                productInfo: productInfo
              });

              //如果是最后一张,则隐藏等待中  
              if (uploadImgCount == tempFilePaths.length) {
                wx.hideToast();
              }
              wx.navigateTo({
                url: "/pages/wzlist/index?detail=" + ""
              })
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
    });
  },  

 /**
   * 选行驶证查询
   */
  radioChange: function(e){
    var self = this;
    console.log(e);
    self.setData({
      xsznumber:e.detail.value
    })
    // wx.showModal({
    //   title: '微信快捷支付',
    //   content: '￥200',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     }
    //   }
    // })
  },
  /**
   * 新增驾驶证
   */
  addInfo: function(){
   this.setData({
     condition:true
   })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})