//index.js
import Promise from '../../utils/wx-pro'
import tools from '../../utils/util.js'
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    date: '请选择出生日期',
    code: '',
    user: '',
    scene: '',
    order_id: '',
    info: '',
    userInfo: ''
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var path = '/pages/index/index'
    if (this.data.order_id ) {
      path = `${path}?scene=${this.data.order_id}`
    }
    return {
      title: '应采儿邀您体验2018新年运势',
      path: path,
      imageUrl: '../../images/share_banner.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onShow: function () {
    const order_id = wx.getStorageSync('order_id')
    this.setData({
      order_id: order_id
    })
    const userInfo = app.globalData.userInfo;
    // 登录
    this.login()
  },
  login() {
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
  },
  onLoad: function(options) {
    console.log('scene' + options.scene)
    let scene = ''
    if (options.scene == undefined) {
      scene = wx.getStorageSync('scene') || ''
    } else {
      scene = options.scene
    }
    console.log('scene' + scene)
    wx.setStorageSync('scene', scene)
    this.setData({
      scene: scene
    })
  },
  // 获取openid
  getOpenId(code) {
    wx.showLoading({
      title: '请稍候..',
    })
    wx.request({
      url: `https://newyear.shunli66.com/api/v1/uid/${code}`,
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
    // 先判断自己有没有下过单
    if (order_id) {
      // 如果下过单，就去看链接上有没有带来源id
      if (scene) {
        if (order_id == scene) {
          wx.redirectTo({
            url: '../result/result'
          })
        }else {
          // 去缓存里面查找有没有曾经匹配过
          var status = true
          origin.forEach((item, index) => {
            // 已经创建过关系
            if (item == scene) {
              status = false
              return
            }
          })
          console.log('status:' + status)
          if(status) {
            const info = Object.assign(user, { origin_order_id: scene });
            console.log(info)
            this.submitHandler(info)
          } else {
            wx.redirectTo({
              url: '../result/result'
            })
          }
          
        }
      } else {
        wx.redirectTo({
          url: '../result/result'
        })
      }
    } else {
      if (wx.getStorageSync('openid')) {
        wx.request({
          url: 'https://newyear.shunli66.com/api/v1/orders',
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
  bindDateChange: function (e) {
    this.setData({
      'date': e.detail.value
    })
  },
  // 下单
  submitHandler(info) {   
    wx.showLoading({
      title: '请稍候...',
    })
    wx.request({
      url: 'https://newyear.shunli66.com/api/v1/orders',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: info,
      success: (res) => {
        wx.hideLoading()
        wx.setStorageSync('order_id', res.data.order_id)
        wx.setStorageSync('user', res.data)
        this.setData({
          order_id: res.data.order_id
        })
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
    // this.openSetting()
    if (wx.getStorageSync('authorize') == 0) {
      wx.showModal({
        title: '授权提示',
        content: '需要您的微信授权才能开启新年运哦~',
        success: (res) => {
          if (res.confirm) {
            this.openSetting()
          }          
        }
      })
    } else {
      // 获取用户信息
      const userInfo = this.data.userInfo || app.globalData.userInfo;
      const time = tools.formatDate(this.data.date);
      const scene = this.data.scene
      console.log(userInfo.avatarUrl)
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
    }
  },
  // 再次授权
  openSetting () {
    var that = this
    if (wx.openSetting) {
      wx.openSetting({
        success: (res) => {
          wx.getUserInfo({
            success: res => {
              console.log('12345' + res.userInfo)
              that.setData({
                userInfo: res.userInfo
              })
              // 授权之后将authorize设为1
              wx.setStorageSync('authorize', 1)
              //尝试再次下单
              that.openLuck()
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
      })
    }
  }
})
