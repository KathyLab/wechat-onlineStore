// pages/add-comment/add-comment.js
const util = require('../../utils/util')
const db = require('../../utils/db')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    commentValue: '',
    userInfo: null,
    commentImages: []
  },

  onInput(event){
    this.setData({
      commentValue: event.detail.value.trim()
    })

    console.log(this.data.commentValue)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })

      this.setProduct(options)
    }).catch(err => {
      console.log('未授权登录')
    })

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

  addComment(event){
    let content = this.data.commentValue
    if(!content) return

    wx.showLoading({
      title: '正在发表评论'
    })

    this.uploadImage(images => {
      db.addComment({
        username: this.data.userInfo.nickName,
        avatar: this.data.userInfo.avatarUrl,
        content,
        productId: this.data.product.id,
        images
      }).then(result => {
        wx.hideLoading()

        const data = result.result

        if (data) {
          wx.showToast({
            title: '发表评论成功'
          })

          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      }).catch(err => {
        console.error(err)
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '发表评论失败'
        })
      })
    })
  },

  chooseImage(){
    let currentImages = this.data.commentImages
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        currentImages = currentImages.concat(res.tempFilePaths)

        let end = currentImages.length
        let begin = Math.max(end - 3, 0)
        currentImages = currentImages.slice(begin, end)

        this.setData({
          commentImages: currentImages
        })
      }
    })
  },
  
  previewImage(event){
    let target = event.currentTarget
    let src = target.dataset.src
    let urls = target.dataset.urls

    wx.previewImage({
      current: src,
      urls: urls
    })
  },

  uploadImage(callback){
    let commentImages = this.data.commentImages
    let images = []

    if (commentImages.length) {
      let length = commentImages.length
      for (let i = 0; i < length; i++){
        db.uploadImage(commentImages[i]).then(result => {
          images.push(result.fileID)
          length--
          if (length <= 0) {
            callback && callback(images)
          }
        }).catch( err => {
          console.log('err', err)
        })
      }
    } else {
      callback && callback(images)
    }
  }
})