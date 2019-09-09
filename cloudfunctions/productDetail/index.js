// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//调用数据库
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const id = event.id
  // collection 获取集合的引用， doc 获取记录的引用
  const productRes = await db.collection('product').doc(id).get()
  const product = productRes.data
  // 获取该产品的总评论数
  const commentCountRes = await db.collection('comment').where({
    productId: id,
  }).count()

  product.commentCount = commentCountRes.total

  // 获取该产品第一条评论
  const firstCommentRes = await db.collection('comment').where({
    productId: id
  }).limit(1).get()
  product.firstComment = firstCommentRes.data[0]
  
  return product
}