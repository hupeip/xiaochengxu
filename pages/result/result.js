// pages/result/result.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    resultData: '',
    list: '',
    order_id: '',
    ewm: '',
    timestamp: Date.parse(new Date()) / 1000
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var path = '/pages/index/index'
    if (this.data.order_id) {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const order_id = wx.getStorageSync('order_id') || ''
    const result = wx.getStorageSync('result') || {}
    this.setData({
      order_id: order_id
    })
    const test = this.data.timestamp - result.timestamp
    // 先从缓存拿结果数据，如果缓存大于一天，则重新获取结果
    if (result.order_id) {
      const test = this.data.timestamp - result.timestamp
      if (test <= 86400) {
        this.setData({
          resultData: result
        })
      } else {
        this.getResult(order_id)
      }
    } else {
      this.getResult(order_id)
    }  
    this.getLogs(order_id)
  },
  // 获取结果数据
  getResult(order_id) {
    wx.showLoading({
      title: '请稍等',
    })
    wx.request({
      url: `https://newyear.shunli66.com/api/v1/orders/${order_id}/result`,
      method: 'GET',
      success: (res) => {
        wx.hideLoading()
        const result = res.data
        if (result.msg) {
          wx.showToast({
            title: result.msg,
            duration: 2000,
            image: '../../images/toast-icon.png'
          })
          return;
        }
        this.setData({
          resultData: result
        })
        const resultData = Object.assign(result, { timestamp: this.data.timestamp })
        wx.setStorageSync('result', resultData)
      }
    })
  },
  // 获取好友匹配记录
  getLogs(order_id) {
    wx.request({
      url: `https://newyear.shunli66.com/api/v1/orders/${order_id}/log`,
      method: 'GET',
      data: {
        order_id: order_id,
        current: 1,
        per_page: 15
      },
      success: (res) => {
        const result = res.data
        if (result.msg) {
          wx.showToast({
            title: '请求匹配列表失败',
            duration: 2000,
            image: '../../images/toast-icon.png'
          })
          return;
        }
        this.originStorage(result.lists)
        this.setData({
          list: result
        })
      }
    })
  },

  // 将好友匹配的origin_id 存在缓存中
  originStorage(list) {
    var origin = []
    list.map((item, index) => {
      origin.push(item.origin_order_id)
    })
    wx.setStorageSync('origin_list', origin)
  },

  gotoRelation(event) {
    // console.log('sds', log_id)
    const order_id = event.currentTarget.dataset.orderid
    const log_id = event.currentTarget.dataset.logid
    wx.navigateTo({
      url: `../match/match?log_id=${log_id}&order_id=${order_id}`
    })
  },
  gotoTouch() {    
    wx.navigateTo({
      url: '../touch/touch'
    })
  },
  gotoShare() {
    wx.navigateTo({
      url: `../share/share?order_id=${this.data.order_id}`
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    console.log('load')
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})