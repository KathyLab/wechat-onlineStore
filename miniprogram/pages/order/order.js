// pages/order/order.js

const util = require('../../utils/util')
const db = require('../../utils/db')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    orderList: [], // 订单列表
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

      this.getOrders()
    }).catch(err => {
      console.log('未授权登录')
    })
  },
  
  getOrders() {
    wx.showLoading({
      title: '刷新订单数据...',
    })

    db.getOrders().then(res => {
      wx.hideLoading()

      const data = res.result

      if(data){
        this.setData({
          orderList: data
        })
      }
    }).catch(err => {
      console.error(err)
      wx.hideLoading()

      wx.showToast({
        icon: 'none',
        title: '刷新订单数据失败',
      })
    })
  }
})