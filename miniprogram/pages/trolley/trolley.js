// pages/trolley/trolley.js
const util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onTapLogin(event) {
    this.setData({
      userInfo: event.detail.userInfo
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    }).catch(err => {
      console.log('未授权登录')
    })
  }

})