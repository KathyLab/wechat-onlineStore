
module.exports = {
  priceFormat: (price) =>{
    return parseFloat(Math.round(price * 100) / 100).toFixed(2)
  },

  getUserInfo() {
    return new Promise((resolve, reject) => {
     this.isAuthenticated().then(() => {
      //已同意授权，获取用户信息
       wx.getUserInfo({
         success: res => {
           const userInfo = res.userInfo
           resolve(userInfo)
         }
       })
     }).catch(() => {
       reject()
     })
    })
  },

  isAuthenticated: () => {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if(res.authSetting['scope.userInfo'] === true){
            resolve()
          }else{
            reject()
          }
        }
      })
    })
  }
}