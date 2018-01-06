// pages/share/share.js

//获取应用实例
const app = getApp()
// import '../../utils/img.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    height: '',
    markData: [
      '人艰不拆当自强', '人艰不拆当自强', '人艰不拆当自强', '人艰不拆当自强', '人艰不拆当自强', '人艰不拆当自强', '人艰不拆当自强'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
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

    var that = this
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        that.setData({
          height: res.windowHeight
        })
        console.log('height=' + res.windowHeight, res.pixelRatio);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          second_height: res.windowHeight - res.windowWidth / 750 * 300
        })
      }
    })

    // console.log(this.data.userInfo)
    // const ctx = wx.createCanvasContext('mycanvas')
    // ctx.beginPath()
    // // ctx.arc(100, 75, 37.5, 0, 2 * Math.PI)
    // // ctx.setStrokeStyle('#d0104c')
    // // ctx.stroke()
    // ctx.drawImage('https://zxcs.ggwan.com/forecastbazijingpibundle/images/yh/banner_v2.jpg', 0, 0, 37.5, 37.5)
    // ctx.draw()

  },
  tapImg () {
    wx.canvasToTempFilePath({
      x: 100,
      y: 200,
      width: 500,
      height: 500,
      destWidth: 500,
      destHeight: 500,
      canvasId: 'mycanvas',
      success: function (res) {
        console.log(res.tempFilePath)
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