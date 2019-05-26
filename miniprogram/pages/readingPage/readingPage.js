// pages/readingPage/readingPage.js
var interval = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      title: options.title,
      content: decodeURIComponent(options.content)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!interval && this.data.time != 0) {
      interval = setInterval(() => {
        this.setData({
          time: this.data.time + 1,
          displayTime: this.parseTime(this.data.time)
        })
      }, 10);
    }
  },

  onHide: function () {
    var that = this
    clearInterval(interval);
    interval = null;
    console.log(that.data.time)
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('user').doc(app.globalData.id).get({
      success: res => {
        var time = parseInt(res.data.time_counter) + that.data.time
        db.collection('user').doc(app.globalData.id).update({
          data: {
            time_counter: _.set(time)
          }
        })
      }
    })
    this.setData({
      isClick: 0,
      time: 0,
    })
  },

  getContent: function (e) {
    console.log(e)
  },

  addNote: function (e) {
    var that = this
    console.log(e)
  }
})