function formatTime() {
  var date = new Date();
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [hour, minute].map(formatNumber).join(':');
}
function formatDate(date){
if(date=="") return this.getNowTime();
if(date.indexOf('-') > -1) return date;
return date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2);
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function getNowTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };

  var formatDate = year + '-' + month + '-' + day;
  return formatDate;
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getNowTime: getNowTime
}
