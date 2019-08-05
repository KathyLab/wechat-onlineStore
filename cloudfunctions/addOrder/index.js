// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  //获取openId
  const user =  wxContext.OPENID
  //或者
  //const user = event.userInfo.openId
   
  const productList = event.list || []
  const isTrolleyBuy = !!event.isTrolleyBuy
  
  await db.collection('order').add({
    data: {
      user,
      createTime: +new Date(),
      productList
    }
  })

  if(isTrolleyBuy){
    await db.collection('trolley').where({
      _id: db.command.in(productList.map(product => product._id))
    }).remove()
  }
  
  return {}
}