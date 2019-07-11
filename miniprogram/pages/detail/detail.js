// pages/detail/detail.js

const db = require('../../utils/db')
const util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductDetail(options.id)
  },
  
  getProductDetail(id){
    wx.showLoading({
      title: 'Loading...',
    })
    //调用云函数
    db.getProductDetail(id).then(result => {
      wx.hideLoading()
      const data = result.result
      if (data) {
        data.price = util.priceFormat(data.price)
        this.setData({
          product: data
        })
      } else {   //云函数调用发生错误时的处理
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()

      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    })
  }
})