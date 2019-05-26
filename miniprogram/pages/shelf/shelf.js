// pages/shelf/shelf.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    cover: 'images/cover.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var shelf = app.globalData.shelf
    console.log(shelf)
    var count = 0
    var data = []
    if (shelf.length <= 3) {
      for (var j = 0; j < 3; j++) {
        if (j >= shelf.length) {
          var obj = {
            'name': '',
          }
        } else {
          var obj = {
            'name': shelf[j],
            'cover': that.data.cover
          }
        }
        console.log(obj)
        data.push(obj)
      }
      var n = "books[" + count + "]"
      that.setData({
        [n]: data
      })
    } else {
      for (var i = 0; i < shelf.length; i + 3) {
        var m = shelf.slice(i, i + 4)
        var data = []
        for (var j = 0; j < 3; j++) {
          var obj = {
            'name': m[j],
            'cover': that.data.cover
          }
          console.log(obj)
          data.push(obj)
        }
        var n = "books[" + count + "]"
        that.setData({
          [n]: data
        })
      }
    }
    console.log(that.data.books)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  openBook: function (e) {
    var that = this
    var name = e.currentTarget.dataset.name
    const db = wx.cloud.database()
    const _ = db.command
    // 根据书名和用户ID在bookCollection中找到fileID
    db.collection('bookCollection').where({
      bookName: _.eq(name),
      bookOwner: app.globalData.id
    }).get({
      success: res => {
        console.log(res.data)
        var fileID = res.data.reverse()[0].bookFileId
        // console.log(fileID)
        // 根据fileID换取https地址
        wx.cloud.getTempFileURL({
          fileList: [fileID],
          success: res => {
            // get temp file URL
            console.log(res.fileList)
            var data = res.fileList[0].tempFileURL
            wx.request({
              url: data,
              data: {},
              success: res => {
                console.log("succeed")
                var query_clone = res.data
                wx.navigateTo({
                  url: '../readingPage/readingPage?content=' + encodeURIComponent(query_clone) + '&title=' + name,
                })
              }
            })

          },
          fail: err => {
            // handle error
          }
        })
      },
      fail: console.err
    })
  },
})