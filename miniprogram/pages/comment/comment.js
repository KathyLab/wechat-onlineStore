// pages/comment/comment.js

const db = require('../../utils/db')
const util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    commentList: [] // 评论列表
  },

  previewImg(event){
    let target = event.currentTarget
    let src = target.dataset.src
    let urls = target.dataset.urls

    wx.previewImage({
      current: src,
      urls: urls
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setProduct(options)
    this.getComments(options.id)
  },

  setProduct(options){
    let product = {
      id: options.id,
      name: options.name,
      price: options.price,
      image: options.image
    }
    this.setData({
      product: product
    })
  },

  getComments(productId){
    db.getComments(productId).then(result => {
      const data = result.data
      if (data.length) {
        this.setData({
          commentList: data.map(comment => {
            comment.createTime = util.formatTime(comment.createTime, 'yyyy/MM/dd')
            comment.images = comment.images ? comment.images.split(';') : []
            return comment
          })
        })
      }
    }).catch(err => {
      console.error(err)
    })
  }
})