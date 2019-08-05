// pages/trolley/trolley.js
const util = require('../../utils/util')
const db = require('../../utils/db')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    trolleyList: [], // 购物车商品列表
    trolleyCheckMap: {}, // 购物车中选中的id哈希表
    trolleyAccount: 0, // 购物车结算总价
    isTrolleyEdit: false, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: false, // 购物车中商品是否全选
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })

      this.getTrolley()

    }).catch(err => {
      console.log('未授权登录')
    })
  },
  
  onTapLogin(event) {
    this.setData({
      userInfo: event.detail.userInfo
    })

    this.getTrolley()
  },

  getTrolley(){
    wx.showLoading({
      title: '刷新购物车数据...',
    })

    const trolleyCheckMap = this.data.trolleyCheckMap

    db.getTrolley().then(res => {
      wx.hideLoading()

      const data = res.result

      if(data.length){
        // 总金额
        // let checkout = 0;
        // data.forEach(product => {
        //   checkout += product.price * product.count
        // })

        this.setData({
          trolleyAccount: util.priceFormat(0),
          trolleyList: data
        })
      }
    }).catch(err => {
      console.error(err)
      wx.hideLoading()

      wx.showToast({
        icon: 'none',
        title: '数据刷新失败',
      })
    })
  },

  onTapCheckSingle(event) {
    let checkId = event.currentTarget.dataset.id
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let trolleyAccount = this.data.trolleyAccount
    let numTotalProduct
    let numCheckedProduct = 0

    // 单项商品被选中/取消
    trolleyCheckMap[checkId] = !trolleyCheckMap[checkId]

    // 判断选中的商品个数是否需商品总数相等
    numTotalProduct = trolleyList.length
    trolleyList.forEach(product => {
      numCheckedProduct = trolleyCheckMap[product._id] ? numCheckedProduct + 1 : numCheckedProduct
    })

    isTrolleyTotalCheck = (numTotalProduct === numCheckedProduct) ? true : false

    trolleyAccount = this.calcAccount(trolleyList, trolleyCheckMap)

    this.setData({
      trolleyCheckMap,
      isTrolleyTotalCheck,
      trolleyAccount
    })
  },

  onTapCheckTotal(event) {
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let trolleyAccount = this.data.trolleyAccount

    // 全选按钮被选中/取消
    isTrolleyTotalCheck = !isTrolleyTotalCheck

    // 遍历并修改所有商品的状态
    trolleyList.forEach(product => {
      trolleyCheckMap[product._id] = isTrolleyTotalCheck
    })

    trolleyAccount = this.calcAccount(trolleyList, trolleyCheckMap)

    this.setData({
      isTrolleyTotalCheck,
      trolleyCheckMap,
      trolleyAccount
    })

  },

  calcAccount(trolleyList, trolleyCheckMap){
    let account = 0
    trolleyList.forEach(product => {
      account = trolleyCheckMap[product._id] ? account + product.price * product.count : account
    })
    return account
  },

  onTapEditTrolley(){
    let isTrolleyEdit = this.data.isTrolleyEdit
    if(!isTrolleyEdit){
      this.setData({
        isTrolleyEdit: !isTrolleyEdit
      })
    }else {
      this.updateTrolley()
    }
    
  },

  adjustTrolleyProductCount(event){
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let dataset = event.currentTarget.dataset
    let adjustType = dataset.type
    let productId = dataset.id
    // let product = trolleyList.find(product => product._id === productId) || {}
    let product
    let index

    for(index = 0; index < trolleyList.length; index++){
      if(productId === trolleyList[index]._id){
        product = trolleyList[index]
        break
      }
    }

    if(product){
      if(adjustType == 'add'){
        //点击加号
        product.count++
      }else{
        //点击减号
        if(product.count <= 1){
          //商品数量不超过1， 点击减号相当于删除
          delete trolleyCheckMap[productId]
          trolleyList.splice(index, 1)
        }else {
          //商品数量大于1
          product.count--
        }
      }
    }

    //调整结算总价
    let trolleyAccount = this.calcAccount(trolleyList, trolleyCheckMap)

    this.setData({
      trolleyAccount,
      trolleyList,
      trolleyCheckMap
    })

    if(!trolleyList.length){
      this.updateTrolley()
    }
  },

  updateTrolley(){
    wx.showLoading({
      title: '刷新购物车数据',
    })

    const trolleyList = this.data.trolleyList

    db.updateTrolley(trolleyList).then(res => {
      wx.hideLoading()

      const data = res.result

      if(data){
        this.setData({
          isTrolleyEdit: false
        })
      }
    }).catch(err => {
      console.log(err)

      wx.hideLoading()

      wx.showToast({
        icon: 'none',
        title: 'Failed'
      })
    })
  },

  onTapPay(){
    if (!this.data.trolleyAccount){
      wx.showToast({
        icon: 'none',
        title: '请选择商品',
      })
      return
    }

    wx.showLoading({
      title: '结算中...',
    })

    const trolleyCheckMap = this.data.trolleyCheckMap
    const trolleyList = this.data.trolleyList
    const needToPayProductList = trolleyList.filter(product => {
      return !!trolleyCheckMap[product._id]
    })
    const trolleyUpdate = trolleyList.filter(product => !trolleyCheckMap[product._id])

    db.addOrder({
      list: needToPayProductList,
      isTrolleyBuy: true
    }).then(res => {
      wx.hideLoading()

      const data = res.result

      if(data){
        wx.showToast({
          title: '结算成功',
        })

        this.setData({
          trolleyList: trolleyUpdate
        })

        this.getTrolley()
      }
    }).catch(err => {
      console.log(err)
      wx.hideLoading()

      wx.showToast({
        icon: 'none',
        title: 'Failed',
      })
    })
  }

  
})