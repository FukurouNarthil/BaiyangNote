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
    var count = 0
    var data = []

    that.setData({
      books: that.displayShelf(shelf)
    })

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

  displayShelf: function (s) {
    var that = this
    var length = s.length
    var books = []
    var count = 0
    while(count < length) {
      var data = []
      if (count + 3 >= length) {
        for (var j = 0; j < 3; j++) {
          if (j+count >= length) {
            var obj = {
              'name': '',
            }
          } else {
            var obj = {
              'name': s[count + j],
              'cover': that.data.cover
            }
          }
          // console.log(obj)
          data.push(obj)
        }
        books.push(data)
      } else {
        var m = s.slice(count, count + 3)
        // console.log(m)
        for (var j = 0; j < 3; j++) {
          var obj = {
            'name': m[j],
            'cover': that.data.cover
          }
          // console.log(obj)
          data.push(obj)
        }
        // console.log(data)
        books.push(data)
      }
      count += 3
    }
    return books
  },

  openBook: function(e) {
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

  // 删除书本
  delBook: function (e) {
    var that = this
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确认移除本书吗？',
      success(res) {
        if(res.confirm) {
          var name = e.currentTarget.dataset.name
          const db = wx.cloud.database()
          const _ = db.command
          // 移除user表中shelf数组里的该书本
          db.collection('user').doc(app.globalData.id).get({
            success: res => {
              var s = res.data.shelf
              var i = s.indexOf(name)
              s.splice(i, 1)
              that.setData({
                books: that.displayShelf(s)
              })
              db.collection('user').doc(app.globalData.id).update({
                data: {
                  shelf: s
                }
              })
              db.collection('bookCollection').where({
                bookName: _.eq(name),
                bookOwner: app.globalData.id
              }).remove()
            }
          })
        }
      }
    })
  }
})