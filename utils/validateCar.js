// 车牌号的正则表达式
function validateCar(carbrand) {
  //车牌号判断的正则表达式
  var regExp = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/
  if (!regExp.test(carbrand)) {
    wx.showToast({
      title: '车牌号有误！',
      icon: 'success',
      duration: 1500
    })
    return false;
  } else {
    console.log("车牌号正确")
  }
  return true;
}
module.exports = {
  validateCar: validateCar
}

