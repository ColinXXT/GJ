var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:"",
    birthday:"",
    country:"",
    drivingModel: "",
    evidenceData:"",
    lienceNumber: "",
    name:"",
    sex:"",
    usefulFromData:"",
    usefulToData:"",
    wxlist:null,
    chejia:"",
    chepai:"",
    wzOrder: "",
    wzfk: "",
    act: "",
    wzcity: "",
    wzdate: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var data = JSON.parse(options.driverInfo);
    this.setData({
      chepai:app.globalData.chepai,
      chejia:app.globalData.chejia,
      lienceNumber: data.lienceNumber,
      name: data.name,
      sex: data.sex,
      drivingModel: data.drivingModel,
      address: data.address,
      birthday: data.birthday,
      country: data.country,
      evidenceData: data.evidenceData,
      usefulFromData: data.usefulFromData,
      usefulToData: data.usefulToData,
      wzOrder: options.wzOrder,
      wzfk: options.wzfk,
      act: options.act,
      wzcity: options.wzcity,
      wzdate: options.wzdate
     })
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  inputlinsener: function (e) {
    console.log(e)
    let val = e.target.dataset.id;
    switch (val) {
      case 'name':
        this.setData({
          name: e.detail.value
        })
        break;
      case 'sex':
        this.setData({
          sex: e.detail.value
        })
        break;
      case 'drivingModel':
        this.setData({
          drivingModel: e.detail.value
        })
        break;
      case 'lienceNumber':
        this.setData({
          lienceNumber: e.detail.value
        })
      break;    
    }
  },
  save:function(){
    var self =this;
    if (self.data.name == "") {
      wx.showModal({
        title: '温馨提示',
        content: "姓名不能为空"
      })
      return;
    }
    if (self.data.sex == "") {
      wx.showModal({
        title: '温馨提示',
        content: "性别不能为空"
      })
      return;
    }
    if (self.data.drivingModel == "") {
      wx.showModal({
        title: '温馨提示',
        content: "准驾车型不能为空"
      })
      return;
    }
    if (self.data.lienceNumber == "") {
      wx.showModal({
        title: '温馨提示',
        content: "驾驶证不能为空"
      })
      return;
    }
    wx.showModal({
      title: '温馨提示',
      content: '扫描结果可能存在误差，请确定无误后查询！',
      success: function (res) {
        if (res.confirm) {
    wx.showLoading({
      title: '保存中...',
    })
    wx.request({
      url: app.globalData.host + '/personLicence/save',
      data: {
        lienceNumber: self.data.lienceNumber,
        name: self.data.name,
        sex: self.data.sex,
        drivingModel: self.data.drivingModel,
        address: self.data.address,
        birthday: self.data.birthday,
        country: self.data.country,
        evidenceData: self.data.evidenceData,
        usefulFromData: self.data.usefulFromData,
        usefulToData: self.data.usefulToData
      },
      header: {
        'token': wx.getStorageSync('token')
      },
      method: "POST",
      success: function (res) {
        var res = res;
        console.log("response", res);
        if (res.data.httpStatus == 200) {
          wx.navigateTo({
            url: "/pages/dxwz/index?wzOrder=" + self.data.wzOrder + "&wzfk=" + self.data.wzfk + "&wzdate=" + self.data.wzdate + "&wzcity=" + self.data.wzcity + "&act=" + self.data.act
          })
        } else if (res.data.httpStatus == 401) {
          wx.navigateTo({
            url: '../authorize/index',
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: '保存失败',
            icon: "none"
          })
        }
        wx.hideLoading()
      }, fail(res) {
        wx.showModal({
          title: '温馨提示',
          content: '请求超时，请重试',
        })
        wx.hideLoading()
      }
    })
  }
}
})},
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
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})