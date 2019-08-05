// pages/detail/detail.js

const db = require('../../utils/db')
const util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {}
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
  },
  buy(){
    wx.showLoading({
      title: '商品购买中...',
    })

    const product = Object.assign({
      count: 1
    }, this.data.product)


    db.addOrder({
      list: [product]
    }).then(res => {
      wx.hideLoading()

      const data = res.result

      if(data){
        wx.showToast({
          title: '商品购买成功',
        })
      }
      // else{
      //   wx.showToast({
      //     icon: 'none',
      //     title: '商品购买失败',
      //   })
      // }
    }).catch(err => {
      console.error(err)
      wx.hideLoading()

      wx.showToast({
        icon: 'none',
        title: '商品购买失败',
      })
    })
  },

  addToTrolley(){
    wx.showLoading({
      title: '正在添加到购物车...',
    })

    db.addToTrolley(this.data.product).then(res => {
      wx.hideLoading()

      const data = res.result
      console.log(data)

      if(data){
        wx.showToast({
          title: '已添加到购物车',
        })
      }
    }).catch(err => {
      console.error(err)
      wx.hideLoading()()

      wx.showToast({
        icon: 'none',
        title: '添加到购物车失败',
      })
    })
  }
})