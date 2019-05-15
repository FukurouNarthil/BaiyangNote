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
    latest_books: ["高等数学", "Python编程", "Linux从入门到放弃", "Java：学不会"],
    bookpage: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
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

  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },


  parseTime: function() {
    var hh = parseInt(this.data.time / 100 / 3600);
    if(hh < 10) hh = '0' + hh;
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
    if(e.currentTarget.dataset.page == "timer"){
      wx.switchTab({
        url: '../calendar/calendar',
      })
    } else {
      wx.navigateTo({
        url: '../shelf/shelf',
      })
    }
  },

  readFile: function(e) {
    console.log(getApp().globalData.id)
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        const tempFilePath = res.tempFiles
        console.log(tempFilePath[0].path)
        wx.getFileSystemManager().readFile({
          filePath: tempFilePath[0].path,
          encoding: 'binary',
          success: res => {
            wx.cloud.callFunction({
              name: 'transCoding',
              data: {
                text: res.data
              }, 
              success: res => {
                console.log(res.result.str)
                wx.navigateTo({
                  url: '../readingPage/readingPage?content=' + res.result.str,
                })
              },

            })
        //     // wx.cloud.uploadFile({
        //     //   cloudPath: 'books/4.txt',
        //     //   filePath: tempFilePath[0].path,
        //     //   success: function (res) {
        //     //     console.log(res.fileID)
        //     //   },
        //     //   fail: console.err
        //     // })
          }
        })
      }
    })
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('user').doc(getApp().globalData.id).update({
      data: {
        shelf: _.push(2)
      },
    })
  },

  downFile: function() {
    console.log("hello")
    // wx.downloadFile({
    //   url: 'https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/books/example.txt?sign=577db942a4c228fce7f3a226a87aa20b&t=1557495557',
    //   success: function(res) {
    //     console.log("succeed")
    //     const filePath = res.tempFilePath
    //     console.log(res.fileContent)
    //     wx.openDocument({
    //       filePath,
    //       success: function (res) {
    //         console.log(res)
    //       },
    //       fail: console.err
    //     })
    //   }, 
    //   fail: console.err
    // })
    wx.request({
      url: 'https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/books/3.txt?sign=de1d3facb2909c6e6b89777be8443f26&t=1557729299',
      data: {},
      success: res => {
        console.log("succeed")
        //var query_clone = JSON.parse(decodeURIComponent(JSON.stringify(res.data)));
        var query_clone = res.data
        console.log(query_clone.toString("gb2312"))
        wx.cloud.callFunction({
          name: 'transCoding',
          data: {
            text: query_clone
          },
          success: res => {
            console.log("succeed")
            console.log(res)
            wx.navigateTo({
              url: '../readingPage/readingPage?content=' + query_clone,
            })
          },
          fail: console.err
        }) 
      }
    })
  }
})