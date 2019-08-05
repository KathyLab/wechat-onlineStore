// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const user = wxContext.OPENID
  const productId = event._id

  const trolleyRes = await db.collection('trolley').where({
    productId,
    user,
  }).get()
  const trolleyList = trolleyRes.data

  if (!trolleyList.length) {
    await db.collection('trolley').add({
      data: {
        productId,
        count: 1,
        user,
        image: event.image,
        name: event.name,
        price: event.price,
      },
    })
  } else {
    const count = trolleyList[0].count + 1
    await db.collection('trolley').doc(trolleyList[0]._id).update({
      data: {
        count,
      },
    })
  }

  return {}
}