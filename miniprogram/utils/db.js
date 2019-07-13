/***云开发函数***/

//获取数据库引用
const db = wx.cloud.database({
  env: 'kathylab-1ra3b'    //环境ID
})

module.exports = {
  getProductList() {
    return db.collection('product').get()
  },

  getProductDetail(id){
    //调用云函数
    return wx.cloud.callFunction({
      name: 'productDetail',
      data: {
        id: id
      }
    })
  }
}