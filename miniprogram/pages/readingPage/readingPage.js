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
    // 清空系统剪贴板
    wx.setClipboardData({
      data: '',
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data)
          }
        })
      }
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

  onHide: function () {
    var that = this
    that.stopTimer()
  },

  onUnload: function () {
    var that = this
    that.stopTimer()
  },

  addNote: function (e) {
    var that = this
    console.log(e)
    wx.getClipboardData({
      success(res) {
        console.log(res.data)
        if(res.data) {
          // 将剪贴板中的内容加入笔记
          const db = wx.cloud.database()
          const _ = db.command
          db.collection('note').add({
            data: {
              userID: app.globalData.id,
              bookName: that.data.title,
              noteContent: res.data
            },
            success: res => {
              // 在返回结果中会包含新创建的记录的 _id
              db.collection('user').doc(app.globalData.id).update({
                data: {
                  noteId: _.push(res._id)
                },
              })
              wx.setClipboardData({
                data: '',
              })
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '新增记录失败'
              })
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
        }
      }
    })
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