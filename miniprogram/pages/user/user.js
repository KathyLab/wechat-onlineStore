// pages/user/user.js

const util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    // userInfo: {
    //   nickName: "优达学城",
    //   avatarUrl: "", // 头像 URL 地址
    // }, // 虚拟数据
  },
  onTapLogin(event){
    this.setData({
      userInfo: event.detail.userInfo
    })
  },
  onTapAddress(){
    wx.showToast({
      icon: 'none',
      title: '此功能暂未开放'
    })
  },

  onTapKf(){
    wx.showToast({
      icon: 'none',
      title: '此功能暂未开放'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function (options) {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    }).catch(err => {
      console.log('未授权登录')
    })
  }

})