// pages/share/share.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    height: '',
    markData: [
      '人艰不拆当自强', '人艰不拆当自强', '人艰不拆当自强', '人艰不拆当自强', '人艰不拆当自强', '人艰不拆当自强', '人艰不拆当自强'
    ],
    url: ''
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
      title: '应采儿邀您体验新年运势',
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
  onLoad: function (options) {
    this.setData({
      url: `https://newyear.linghit.com/2018/newyearluck?scene=${options.order_id}`
    })
  },
})