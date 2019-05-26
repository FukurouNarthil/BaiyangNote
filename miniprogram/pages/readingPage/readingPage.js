// pages/readingPage/readingPage.js
const app = getApp()
var interval = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    time: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    this.setData({
      title: options.title,
      content: decodeURIComponent(options.content)
    })
    if (!interval) {
      interval = setInterval(() => {
        this.setData({
          time: this.data.time + 1,
        })
        // console.log(that.data.time)
      }, 1000);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  onHide: function () {
    var that = this
    that.stopTimer()
  },

  onUnload: function () {
    var that = this
    that.stopTimer()
  },

  getContent: function (e) {
    console.log(e)
  },

  addNote: function (e) {
    var that = this
    console.log(e)
  },

  stopTimer: function () {
    var that = this
    clearInterval(interval);
    interval = null;
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('user').doc(app.globalData.id).get({
      success: res => {
        var time = parseInt(res.data.time_counter) + that.data.time
        console.log(time)
        db.collection('user').doc(app.globalData.id).update({
          data: {
            time_counter: _.set(time)
          }
        })
        that.setData({
          isClick: 0,
          time: 0,
        })
      },
      fail: console.err
    })
  }
})