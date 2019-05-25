//index.js
const app = getApp()
var interval = null;

Page({
  data: {
    pages: ['timer', 'shelf'],
    imgUrl: 'images/timerFrame.png',
    previousMargin: 30,
    nextMargin: 30,
    idx: 1,
    current: 1,
    isClick: 0,
    time: 0,
    displayTime: '00:00:00',
    latest_books: [],
    bookpage: '',
    tempFileUrl: []
  },

  onLoad: function() {

    var that = this
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    app.getUserInfo().then(function(res) {
      console.log(res)
      var shelf = res.data.shelf
      that.setData({
        latest_books: shelf
      })
      console.log(that.data.latest_books)
      that.getBookContent(0)
    })
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  onShow: function() {

    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    
    if (!interval && this.data.time != 0) {
      interval = setInterval(() => {
        this.setData({
          time: this.data.time + 1,
          displayTime: this.parseTime(this.data.time)
        })
      }, 10);
    }
  },

  onHide: function() {
    console.log('onHide...')
    if (interval) {
      clearInterval(interval);
      interval = null;
    } else {
      this.setData({
        time: 0,
        displayTime: '00:00:00'
      })
    }
  },

  parseTime: function() {
    var hh = parseInt(this.data.time / 100 / 3600);
    if (hh < 10) hh = '0' + hh;
    var mm = parseInt(this.data.time / 100 / 60 % 60);
    if (mm < 10) mm = '0' + mm;
    var ss = parseInt(this.data.time % 6000 / 100);
    if (ss < 10) ss = '0' + ss;
    return `${hh}:${mm}:${ss}`
  },

  startTimer: function() {
    if (!interval) {
      interval = setInterval(() => {
        this.setData({
          isClick: 1,
          time: this.data.time + 1,
          displayTime: this.parseTime(this.data.time)
        })
      }, 10);
    }
  },

  stopTimer: function() {
    clearInterval(interval);
    interval = null;
    this.setData({
      isClick: 0,
      time: 0,
      displayTime: '00:00:00'
    })
  },

  redirectTo: function(e) {
    if (e.currentTarget.dataset.page == "timer") {
      wx.switchTab({
        url: '../calendar/calendar',
      })
    } else {
      wx.navigateTo({
        url: '../shelf/shelf',
      })
    }
  },

  getBookContent: function(k) {
    var that = this
    var temp = that.data.latest_books[k]
    if (k == that.data.latest_books.length) {
      return
    } else {
      const db = wx.cloud.database()
      const _ = db.command
      // 根据书名和用户ID在bookCollection中找到fileID
      db.collection('bookCollection').where({
        bookName: _.eq(temp),
        bookOwner: app.globalData.id
      }).get({
        success: res => {
          // console.log(res.data)
          var fileID = res.data.reverse()[0].bookFileId
          // console.log(fileID)
          // 根据fileID换取https地址
          wx.cloud.getTempFileURL({
            fileList: [fileID],
            success: res => {
              // get temp file URL
              // console.log(res.fileList)
              var data = "tempFileUrl[" + k + "]"
              that.setData({
                [data]: {
                  name: temp,
                  fileUrl: res.fileList[0].tempFileURL
                }
              })
              console.log(that.data.tempFileUrl)
              k++
              return that.getBookContent(k)
            },
            fail: err => {
              // handle error
            }
          })
        },
        fail: console.err
      })
    }
  },

  readFile: function(e) {
    console.log(getApp().globalData.id)
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        console.log(res)
        const tempFilePath = res.tempFiles
        var filePath = tempFilePath[0].path
        const fileName = tempFilePath[0].name
        console.log(filePath.match(/\.[^.]+?$/)[0])
        if (filePath.match(/\.[^.]+?$/)[0] == '.txt') {
          wx.cloud.uploadFile({
            cloudPath: app.globalData.id + '/' + fileName,
            filePath: tempFilePath[0].path,
            success: function(res) {
              console.log(res.fileID)
              const db = wx.cloud.database()
              const _ = db.command
              db.collection('bookCollection').add({
                data: {
                  bookImage: '',
                  bookName: fileName,
                  bookOwner: app.globalData.id,
                  bookFileId: res.fileID
                },
                success: res => {
                  // 在返回结果中会包含新创建的记录的 _id
                  console.log(fileName)
                  db.collection('user').doc(app.globalData.id).update({
                    data: {
                      shelf: _.push(fileName)
                    }
                  })
                },
                fail: err => {
                  console.error('[数据库] [新增记录] 失败：', err)
                }
              })
            },
            fail: console.err
          })
          // wx.getFileSystemManager().readFile({
          //   filePath: tempFilePath[0].path,
          //   encoding: 'binary',
          //   success: res => {
          //     wx.cloud.callFunction({
          //       name: 'transCoding',
          //       data: {
          //         text: res.data
          //       },
          //       success: res => {
          //         console.log(res.result.str)
          //         wx.navigateTo({
          //           url: '../readingPage/readingPage?content=' + res.result.str,
          //         })
          //       },
          //       fail: console.err
          //     })
          //   }
          // })
        } else {
          wx.showToast({
            icon: 'none',
            title: '只能上传txt文件！',
          })
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    })
    // const db = wx.cloud.database()
    // const _ = db.command
    // db.collection('user').doc(getApp().globalData.id).update({
    //   data: {
    //     shelf: _.push(2)
    //   },
    // })
  },

  downFile: function(e) {
    console.log(e)
    var that = this
    var fileUrlList = that.data.tempFileUrl
    var name = e.currentTarget.dataset.bookname
    var url = fileUrlList.find(function(x) {
      return x.name === name
    }).fileUrl
    console.log(url)
    wx.request({
      url: url,
      data: {},
      success: res => {
        console.log("succeed")
        var query_clone = res.data
        wx.navigateTo({
          url: '../readingPage/readingPage?content=' + encodeURIComponent(query_clone),
        })
      }
    })
  }
})