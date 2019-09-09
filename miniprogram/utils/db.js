/***云开发函数***/

//获取数据库引用
const db = wx.cloud.database({
  env: 'kathylab-1ra3b'    //环境ID
})

const util = require('./util')

module.exports = {
  getProductList: () => {
    return db.collection('product').get()
  },

  getProductDetail: id =>{
    //调用云函数
    return wx.cloud.callFunction({
      name: 'productDetail',
      data: {
        id: id
      }
    })
  },

  addOrder: data => {
    return util.isAuthenticated()
    .then(() => {
      return wx.cloud.callFunction({
        name: 'addOrder',
        data,
      })
    })
    .catch(() => {
      wx.showToast({
        icon: 'none',
        title: '请先登录'
      })
      return {}
    })
    
  },

  getOrders: () => {
    return util.isAuthenticated()
    .then(() => {
      return wx.cloud.callFunction({
        name: 'getOrders',
      })
    })
    .catch(() => {
      wx.showToast({
        icon: 'none',
        title: '请先登录'
      })
      return {}
    })
  },

  addToTrolley: data => {
    return util.isAuthenticated().then(() => {
      return wx.cloud.callFunction({
        name: 'addToTrolley',
        data
      }).catch(() => {
        wx.showToast({
          title: 'Failed',
        })
      })
    }).catch(() => {
      wx.showToast({
        icon: 'none',
        title: '请先登录'
      })

      return {}
    })
  },

  getTrolley: () => {
    return util.isAuthenticated()
      .then(() => {
        return wx.cloud.callFunction({
          name: 'getTrolley'
        }).catch(() => {
          wx.showToast({
            icon: 'none',
            title: 'Failed'
          })
        })
      }).catch(() => {
        wx.showToast({
          icon: 'none',
          title: '请先登录'
        })

        return {}
      })
  },

  updateTrolley(list){
    return util.isAuthenticated()
    .then(() => {
      return wx.cloud.callFunction({
        name: 'updateTrolley',
        data: {
          list
        }
      })
    }).catch(() => {
      wx.showToast({
        icon: 'none',
        title: '请先登录'
      })
      return {}
    })
  },

  addComment(data){
    return util.isAuthenticated().then(() => {
      return wx.cloud.callFunction({
        name: 'addComment',
        data
      }).catch(() => {
        wx.showToast({
          icon: 'none',
          title: '请先登录'
        })
        return {}
      })
    })
  },

  getComments(productId){
    return db.collection('comment').where({
      productId
    }).get()
  },

  uploadImage(imgPath) {
    return wx.cloud.uploadFile({
      cloudPath: `comment/${util.getId()}`,
      filePath: imgPath
    })
  }
}