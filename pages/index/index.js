//index.js
import Promise from '../../utils/wx-pro'
import tools from '../../utils/util.js'
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    date: '请选择出生日期',
    code: '',
    user: '',
    uid: wx.getStorageSync('openid') || '',
    scene: '',
    order_id: '',
    info: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    console.log('show')
    const order_id = wx.getStorageSync('order_id')
    this.setData({
      order_id: order_id
    })
    const userInfo = app.globalData.userInfo;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const openid = wx.getStorageSync('openid')
        if (openid) {
          console.log('openid:存在' + openid)
          this.checkScene()
          return
        }
        this.getOpenId(res.code)
      }
    })    
    // if (order_id) {
    //   // info = Object.assign(info, { order_id: order_id });
    //   wx.redirectTo({
    //     url: '../result/result'
    //   })
    // }
  },
  onLoad: function(options) {
    console.log('load')
    const scene = options.scene || ''
    this.setData({
      scene: scene
    })
  },
  // 获取openid
  getOpenId(code) {
    wx.showLoading({
      title: '获取openid',
    })
    console.log(`https://sandbox-yingcaier-applet.linghit.com/api/v1/uid/${code}`)
    wx.request({
      url: `https://sandbox-yingcaier-applet.linghit.com/api/v1/uid/${code}`,
      method: 'GET',
      data: {
        mina: 'YCAI'
      },
      success: (res) => {
        wx.hideLoading()
        wx.setStorageSync('openid', res.data.uid)
        this.setData({
          uid: res.data.uid
        })
        this.checkScene()
        console.log('openid:获取成功' + res.data.uid)
      },
      fail: (err) => {
        wx.hideLoading()
        console.log(err)
      }
    })
  },
  checkScene() {
    const origin = wx.getStorageSync('origin_list') || []
    const user = wx.getStorageSync('user') || ''
    const order_id = wx.getStorageSync('order_id') || ''
    const scene = this.data.scene   
    if (order_id) {
      if (scene) {
        if (order_id == scene) {
          wx.redirectTo({
            url: '../result/result'
          })
        }else {
          console.log('scene不等于order_id')
          // 去缓存里面查找有没有曾经匹配过
          origin.forEach((item, index) => {
            // 已经创建过关系
            if (item == scene) {
              wx.redirectTo({
                url: '../result/result'
              })
              return
            }
          })
          console.log('sdsdsdsss')
          const info = Object.assign(user, { origin_order_id: scene });
          this.submitHandler(info)
        }
      } else {
        wx.redirectTo({
          url: '../result/result'
        })
      }
    } else {
      if (wx.getStorageSync('openid')) {
        wx.request({
          url: 'https://sandbox-yingcaier-applet.linghit.com/api/v1/orders',
          method: 'GET',
          data: {
            uid: wx.getStorageSync('openid')
          },
          success: (res) => {
            if (res.data.lists.length > 0) {
              wx.setStorageSync('user', res.data.lists[0])
              wx.setStorageSync('order_id', res.data.lists[0].order_id)
              if (scene) {
                const info = Object.assign(res.data.lists[0], { origin_order_id: scene})
                this.submitHandler(info)
              } else {
                wx.redirectTo({
                  url: '../result/result'
                })
              }
              
            }
          }
        })
      }      
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    console.log(e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  bindDateChange: function (e) {
    this.setData({
      'date': e.detail.value
    })
  },
  // 下单
  submitHandler(info) {   
    wx.showLoading({
      title: '下单',
    })
    wx.request({
      url: 'https://sandbox-yingcaier-applet.linghit.com/api/v1/orders',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: info,
      success: (res) => {
        wx.hideLoading()
        wx.setStorageSync('order_id', res.data.order_id)
        wx.setStorageSync('user', res.data)
        wx.redirectTo({
          url: '../result/result'
        })
      }
    })
  },
  openLuck() {
    if (this.data.date == '请选择出生日期') {
      wx.showToast({
        title: '请选择出生日期',
        duration: 2000,
        image: '../../images/toast-icon.png'
      })
      return false;
    }
    const userInfo = app.globalData.userInfo;
    const time = tools.formatDate(this.data.date); 
    const scene = this.data.scene  
    console.log('openidwwwww' + wx.getStorageSync('openid'))
    var info = {
      date: time,
      name: userInfo.nickName,
      avatar: userInfo.avatarUrl,
      mina: 'YCAI',
      uid: wx.getStorageSync('openid'),
    }
    if (scene) {
      info = Object.assign(info, { origin_order_id: scene })
    }
    this.setData({
      info: info
    })
    this.submitHandler(info)

    // openid.then((data) => {
    //   info = Object.assign(info, data);
    //   this.setData({
    //     user: info
    //   })
    // }).then(this.submitHandler)
  }
})
