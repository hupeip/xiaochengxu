//app.js
var Promise = require('./utils/wx-pro').Promise;
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     this.globalData.code = res.code
    //     console.log(res.code)
    //     const openid = wx.getStorageSync('openid')
    //     if (openid) {
    //       console.log('openid:存在' + openid)
    //       return
    //     }
    //     this.getOpenId(res.code)
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              // wx.startRecord()
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo
                  console.log(res.userInfo)
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }
                }
              })
            }
          })
        } else {
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  // // 获取openid
  // getOpenId(code) {
  //   wx.showLoading({
  //     title: '获取openid',
  //   })
  //   console.log(`https://sandbox-yingcaier-applet.linghit.com/api/v1/uid/${code}`)
  //   wx.request({
  //     url: `https://sandbox-yingcaier-applet.linghit.com/api/v1/uid/${code}`,
  //     method: 'GET',
  //     data: {
  //       mina: 'YCAI'
  //     },
  //     success: (res) => {
  //       wx.hideLoading()
  //       this.globalData.openid = res.data.uid
  //       wx.setStorageSync('openid', res.data.uid)
  //       console.log('openid:获取成功' + res.data.uid)
  //     },
  //     fail: (err) => { 
  //       wx.hideLoading()
  //       console.log(err)
  //     }
  //   })
  // },
  globalData: {
    userInfo: null,
    code: null,
    openid: null
  }
})