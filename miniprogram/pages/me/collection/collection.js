const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    userName: "",
    list: [{
      src: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/bookRecommendation.png?sign=095cc12d5a5c203671e7da344d8d0e68&t=1559141019",
        title: "好书推荐",
        abstract:"摘要：猫头鹰文库上线啦～",
        collect_time: "收藏时间：2019-05-02"
      }, { 
        src: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/notOpen.png?sign=9ae95b7863da7762474bc18087317b60&t=1559141521",
        title: "爱心捐书",
        abstract: "摘要：一起来给山区孩子捐书吧！",
        collect_time: "收藏时间：2019-05-10"
      }]
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
            description: res.data[0].description
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