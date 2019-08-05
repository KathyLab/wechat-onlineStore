// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID
  const productList = event.list

  //删除购物车中的所有数据
  await db.collection('trolley').where({
    user
  }).remove()

 for(const product of productList){
   await db.collection('trolley').add({
     data: {
       count: product.count,
       user,
       image: product.image,
       name: product.name,
       price: product.price
     }
   })
 }

 return {}
}