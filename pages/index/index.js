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
  onShow: function () {
    const order_id = wx.getStorageSync('order_id')
    this.setData({
      height: wx.getSystemInfoSync().windowHeight
    })
    this.setData({
      order_id: order_id
    })
    // 登录
    this.login()
  },
  login() {
    wx.showLoading({
      title: '登录中..',
    })
    wx.login({
      success: res => {
        wx.hideLoading()
        const openid = wx.getStorageSync('openid')
        if (openid) {
          this.checkScene()
          return
        }
        this.getOpenId(res.code)
      }
    })
  },
  onLoad: function (options) {
    // 判断来源id
    let scene = ''
    if (options.scene == undefined) {
      scene = wx.getStorageSync('scene') || ''
    } else {
      scene = options.scene
    }
    wx.setStorageSync('scene', scene)
    this.setData({
      scene: scene
    })
    if (app.globalData.userInfo) {      
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.openLuck()
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
      },
      fail: (err) => {
        wx.hideLoading()
        console.log(err)
      }
    })
  },
  checkScene() {
    const origin = wx.getStorageSync('origin_list') || []
    const user = wx.getStorageSync('user') || {}
    const order_id = wx.getStorageSync('order_id') || ''
    const scene = this.data.scene
    // 先判断自己的缓存中有没有订单号，有的话，就证明下过单
    if (order_id) {
      // 如果有，就去看链接上有没有带来源id
      if (scene) {
        // 如果来源id和自己的order_id相等，证明是从自己的二维码打开
        if (order_id == scene) {
          wx.redirectTo({
            url: '../result/result'
          })
        }else {
          // 去缓存里面查找有没有曾经匹配过
          var status = true
          if(origin.length > 0) {
            origin.forEach((item, index) => {
              // 已经创建过关系
              if (item == scene) {
                status = false
                return
              }
            })
          }         
          if(status) {
            // 曾经没有创建过关系，调用接口，直接创建关系，然后去到结果页
            const info = Object.assign(user, { origin_order_id: scene });
            this.submitHandler(info)
          } else {
            // 已经创建过关系，直接去到结果页
            wx.redirectTo({
              url: '../result/result'
            })
          }          
        }
      } else {
        // 下过单，没有带来源id，直接去到结果页
        wx.redirectTo({
          url: '../result/result'
        })
      }
    } else {
      // 如果缓存中没有订单号，先调用接口，看看用户之前有没有下过单
      if (wx.getStorageSync('openid')) {
        // 用户已经授权
        wx.request({
          url: 'https://newyear.shunli66.com/api/v1/orders',
          method: 'GET',
          data: {
            uid: wx.getStorageSync('openid')
          },
          success: (res) => {
            if (res.data.lists.length > 0) {
              // lists的长度大于1，之前已经下过单，但是清了缓存
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
      title: '正在开启您的新年运势...',
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
    // 看用户是否之前拒接授权
    if (wx.getStorageSync('authorize') == 0) {
      // wx.showModal({
      //   title: '授权提示',
      //   content: '需要您的微信授权才能开启新年运哦~',
      //   success: (res) => {
      //     if (res.confirm) {
      //       this.openSetting()
      //     }          
      //   }
      // })
    } else {
      // 获取用户信息
      const userInfo = this.data.userInfo || {};
      const time = tools.formatDate(this.data.date);
      const scene = this.data.scene
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
  // openSetting () {
  //   var that = this
  //   if (wx.openSetting) {
  //     wx.openSetting({
  //       success: (res) => {
  //         wx.getUserInfo({
  //           success: res => {
  //             that.setData({
  //               userInfo: res.userInfo
  //             })
  //             // 授权之后将authorize设为1
  //             wx.setStorageSync('authorize', 1)
  //             //尝试再次下单
  //             that.openLuck()
  //           }
  //         })
  //       }
  //     })
  //   } else {
  //     wx.showModal({
  //       title: '授权提示',
  //       content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
  //     })
  //   }
  // }
})
