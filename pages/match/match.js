// pages/match/match.js
const wxCharts = require('../../utils/wxcharts.js');
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
      url: `https://sandbox-yingcaier-applet.linghit.com/api/v1/orders/${order_id}/log`,
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
      url: `https://sandbox-yingcaier-applet.linghit.com/api/v1/orders/${order_id}/log/${log_id}`,
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
        new wxCharts({
          animation: true, //是否有动画
          canvasId: 'radarCanvas',
          type: 'radar',
          background: '#ffffff',
          categories: ['感情纠缠', '损友潜质', '金钱纠葛', '贵人潜质'],
          series: [{
            name: '关系指数',
            data: [match.result.love_num * 100, match.result.bad_num * 100, match.result.money_num * 100, match.result.good_num * 100]
          }],
          width: 300,
          height: 250,
          extra: {
            radar: {
              max: 100,
              labelColor: '#383030',
              gridColor: '#ffffff'
            }
          }
        }); 
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})