const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    userName: "",
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection('user').where({
      _openid: db.command.eq(app.globalData.openid)
    }).get({
      success: res => {
        console.log(res.data)
        if (res.data[0].userName) {
          this.setData({
            avatarUrl: res.data[0].avatarUrl,
            userName: res.data[0].userName,
            description: res.data[0].description,
            list: res.data[0].bookId_collection,
            collection_count: res.data[0].bookId_collection.length
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.log('[数据库] [查询记录] 失败')
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})