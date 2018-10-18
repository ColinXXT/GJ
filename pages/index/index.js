//index.js
//获取应用实例
const carDetails = [
  {
    "id": "search",
    "cate": "违章服务",
    "detail": [
      {
        "thumb": "/images/cate/bmcw-wz-icon.jpg",
        "name": "违章查询代办",
        "id": "wzcx"
      },
      {
        "thumb": "/images/cate/main5.jpg",
        "name": "敬请期待",
        "id": "dxwz"
      },
    ]
  },
  {
    "id": "carValidate",
    "cate": "汽车服务",
    "detail": [
      {
        "thumb": "/images/cate/bmcw-jz-icon.jpg",
        "name": "汽车年审",
        "id": "qcns"
      }, 
      {
        "thumb": "/images/cate/main1.jpg",
        "name": "汽车过户 (迁）",
        "id": "qcgh"
      },
      {
        "thumb": "/images/cate/main4.jpg",
        "name": "汽车上牌",
        "id": "xcsp"
      },
    ]
  },
  {
    "id": "certService",
    "cate": "证件服务",
    "detail": [
      {
        "thumb": "/images/cate/main9.jpg",
        "name": "证照服务",
        "id": "zjfw"
      },
      {
        "thumb": "/images/cate/bmcw-wts-icon.jpg",
        "name": "驾驶证服务",
        "id": "jszfw"
      },
    ]
  },
  {
    "id": "inspection",
    "cate": "托运服务",
    "detail": [
      {
        "thumb": "/images/cate/main7.jpg",
        "name": "本市车辆",
        "id": "bscl"
      },
      {
        "thumb": "/images/cate/main8.jpg",
        "name": "异地车辆",
        "id": "ydcl"
      }
    ]
  }
];
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false , // loading
    userInfo: {},
    swiperCurrent: 0,  
    selectCurrent:0,
    remind: '加载中',
    category: [
      { name: '违章服务', id: 'search' },
      { name: '汽车服务', id: 'carValidate' },
      { name: '证件服务', id: 'certService' },
      { name: '托运服务', id: 'inspection' }
    ],
    detail: [],
    curIndex: 0,
    isScroll: false,
    toView: 'search',
    index_city: ''
  },
  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  onLoad: function () {
    var that = this
    var imageInfo = [{
      picUrl: "https://lg-8kezvork-1257374224.cos.ap-shanghai.myqcloud.com/banner1.jpg"
    },
      {
        picUrl: "https://lg-8kezvork-1257374224.cos.ap-shanghai.myqcloud.com/banner2.jpg"
      }];
    that.setData({
      banners: imageInfo
    });   
  },

  onShow(){
  },

  onReady() {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    
    that.setData({
      detail: carDetails
    })
  },

  switchTab(e) {
    const self = this;
    this.setData({
      isScroll: true
    })
    setTimeout(function () {
      self.setData({
        toView: e.target.dataset.id,
        curIndex: e.target.dataset.index
      })
    }, 0)
    setTimeout(function () {
      self.setData({
        isScroll: false
      })
    }, 1)

  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
   },
  
  onShareAppMessage: function () {
 
  },

  toDetailsTap: function (e) {
    var svsType = e.currentTarget.dataset.id;
    console.log(svsType)
    console.log(wx.getStorageSync('userInfo'))
    if (wx.getStorageSync('userInfo')==""){
      wx.showModal({
        title: '温馨提示',
        content: '为了给您提供更贴心但服务，请先登录',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../my/index',
            })
          }
        }
      })
      return;
    } else if (wx.getStorageSync('token') == ""){
      wx.showModal({
        title: '温馨提示',
        content: '为了给您提供更贴心但服务，请先授权',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../authorize/index',
            })
          }
        }
      })
      return;
    }
    switch (svsType) {
      case "wzcx":
        wx.navigateTo({
          url: "/pages/wxcx/index?id=" + e.currentTarget.dataset.id
          })
        break;
      case "qcgh":
        wx.navigateTo({
          url: "/pages/carTransfer/index?id=" + e.currentTarget.dataset.id
        })
        break;
      case "xcsp":
        wx.navigateTo({
          url: "/pages/newCar/index?id=" + e.currentTarget.dataset.id
        })
        break;
      case "qcns":
        wx.navigateTo({
          url: "/pages/carVerification/index?id=" + e.currentTarget.dataset.id
        })
          break;
      case "zjfw":
        wx.navigateTo({
          url: "/pages/documentService/index?id=" + e.currentTarget.dataset.id
        })
        break;
      case "jszfw":
        wx.navigateTo({
          url: "/pages/jszService/index?id=" + e.currentTarget.dataset.id
        })
        break;      
      case "bscl":
      case "ydcl":
      case "dxwz":  
        wx.showToast({
          title: '敬请期待！',
          image: '/images/cate/hope.png',
          duration: 1500
        })
        break;

    }
   
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '029-88850320',
    })
  },
})