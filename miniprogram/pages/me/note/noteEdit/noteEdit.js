// pages/me/collection/collection.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    currentUserName: '',
    description: '',
    newAvatarUrl: '',
    newUserName: '',
    newDescription: '',
    defaultBookCover:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.setData({
    //   avatarUrl: options.avatarUrl,
    //   currentUserName: options.username,
    //   description: options.description
    // })
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

  // 上传新头像
  uploadBookCover: function() {
    var self = this
    wx.chooseImage({
      count: 1,
      success: function(res) {
        console.log(res)
        const tempFilePath = res.tempFilePaths[0]
        console.log(tempFilePath.match(/\.[^.]+?$/))
        self.setData({
          avatarUrl: tempFilePath,
          newAvatarUrl: tempFilePath
        })
      },
    })
  },

  // 修改ID
  onGetInputUserName: function(e) {
    var self = this
    console.log(e)
    if (e.detail.value) {
      self.setData({
        currentUserName: e.detail.value
      })
    }
  },

  // 修改个性签名
  onGetInputDescription: function(e) {
    var self = this
    if (e.detail.value) {
      self.setData({
        description: e.detail.value
      })
    }
  },

  // 保存修改
  confirmChange: function(e) {
    var self = this
    var filePath = self.data.newAvatarUrl
    wx.showModal({
      title: '提示',
      content: '确认对个人信息进行更改吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (filePath) {
            console.log(filePath)
            var obj = filePath.lastIndexOf("/");
            var filename = filePath.substr(obj + 1);
            // 上传头像，获取URL
            wx.cloud.uploadFile({
              cloudPath: app.globalData.id + filename,
              filePath: filePath,
              success: res => {
                // get resource ID
                console.log(res)
                // 更新数据库中的用户信息
                const db = wx.cloud.database()
                db.collection('user').doc(app.globalData.id).update({
                  data: {
                    userName: self.data.currentUserName,
                    avatarUrl: res.fileID,
                    description: self.data.description
                  },
                  success: res => {
                    wx.showToast({
                      title: '修改成功！',
                    })
                  },
                  fail: console.err
                })
                self.onShow()
              },
              fail: err => {
                // handle error
                console.log('上传头像失败！')
              }
            })
          } else {
            const db = wx.cloud.database()
            db.collection('user').doc(app.globalData.id).update({
              data: {
                userName: self.data.currentUserName,
                description: self.data.description
              },
              success: res => {
                console.log(res)
                wx.showToast({
                  title: '修改成功！',
                })
              }
            })
            self.onShow()
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 返回信息页
  backToMyPage: function () {
    wx.navigateBack()
  }
})