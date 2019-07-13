// pages/order/order.js

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

  onLoad: function (options) {

  },

  onShow: function (options) {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    })
  }
})