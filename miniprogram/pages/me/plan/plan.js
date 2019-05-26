const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    userName: "",
    items: [
      { plan:"今天的计划是 ",time:"2019-05-01" },
      { plan: "今天的计划是", time: "2019-05-01", checked: 'true' },
      { plan: "今天的计划是  ", time: "2019-05-01" },
      { plan: "今天的计划是 ", time: "2019-05-01" },
      { plan: "今天的计划是 ", time: "2019-05-01" },
      { plan: "今天的计划是 ", time: "2019-05-01" },
    ]
  },

  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
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