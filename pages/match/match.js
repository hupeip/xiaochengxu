// pages/match/match.js
// const wxCharts = require('../../utils/wxcharts.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    metchData: '',
    list: '',
    score: [
      {
        name: '感情纠缠',
        num: 80
      },
      {
        name: '贵人潜质',
        num: 80
      },
      {
        name: '金钱纠葛',
        num: 60
      },
      {
        name: '损友潜质',
        num: 60
      }
    ]
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMatchInfo(options.log_id, options.order_id)
    this.getLogs(options.order_id)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var path = '/pages/index/index'
    const order_id = wx.getStorageSync('order_id')
    if (order_id) {
      path = `${path}?scene=${order_id}`
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
  toNewYear() {
    wx.redirectTo({
      url: '../newyear/newyear'
    })
  },
  gotoTouch() {
    wx.navigateTo({
      url: '../touch/touch'
    })
  },
  gotoRelation(event) {
    const order_id = event.currentTarget.dataset.orderid
    const log_id = event.currentTarget.dataset.logid
    wx.redirectTo({
      url: `../match/match?log_id=${log_id}&order_id=${order_id}`
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
            title: result.msg,
            duration: 2000,
            image: '../../images/toast-icon.png'
          })
          return;
        }
        this.setData({
          list: result
        })
      }
    })
  },
  // 获取匹配信息
  getMatchInfo(log_id, order_id) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `https://newyear.shunli66.com/api/v1/orders/${order_id}/log/${log_id}`,
      method: 'GET',
      success: (res) => {
        wx.hideLoading()
        const match = res.data
        if (match.msg) {
          wx.showToast({
            title: 'sdsd',
            duration: 2000,
            icon: '../../images/toast-icon.png'
          })
          return;
        }
        this.setData({
          metchData: match,
          'score[0].num': parseInt(match.result.love_num * 100, 10),
          'score[1].num': parseInt(match.result.good_num * 100, 10),
          'score[2].num': parseInt(match.result.money_num * 100, 10),
          'score[3].num': parseInt(match.result.bad_num * 100, 10),
        })
      }
    })
  }
})