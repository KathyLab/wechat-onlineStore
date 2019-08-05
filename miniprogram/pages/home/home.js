// pages/home/home.js
const db = require('../../utils/db')
const util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: []  //商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductList()
  },

  getProductList() {
    wx.showLoading({
      title: '商品数据加载中',
    })

    db.getProductList().then(result => {
      // console.log(result)
      wx.hideLoading()

      const data = result.data
      //保留两位小数
      data.forEach(product => product.price = util.priceFormat(product.price))

      if (data.length) {
        this.setData({
          productList: data
        })
      }
      else{
        wx.showToast({
          title: '商品数据加载失败',
        })
      }
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
      wx.showToast({
        title: '商品数据加载失败',
      })
    })

  },

  addToTrolley(event){
    let productId = event.currentTarget.dataset.id
    let productList = this.data.productList
    let product

    for(let i = 0, len = productList.length; i < len; i++){
      if(productList[i]._id === productId){
        product = productList[i]
        break
      }
    }

    if(product){
      db.addToTrolley(product).then(res => {
        wx.hideLoading()

        const data = res.result
        //console.log(data)

        if (data) {
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
 
  }

})