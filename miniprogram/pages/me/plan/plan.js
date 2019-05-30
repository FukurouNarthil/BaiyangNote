const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    userName: "",
    items: [
      { plan: "今天想看完《活着》 ", time: "2019-05-08", checked:false, planDetail:"今天想看完《活着》的第二章！" },
      { plan: "明天看《围城》的p", time: "2019-05-07", checked:true, planDetail: "明天看《围城》的p101-p109" },
      { plan: "这周把围城看完", time: "2019-05-01", checked:false, planDetail: "这周把围城看完" },
      { plan: "今天想看《在细雨中 ", time: "2019-04-28", checked:false, planDetail: "今天想看《在细雨中呼喊》！"},
      { plan: "今天的《而已集》看", time: "2019-04-20", checked:false, planDetail: "今天的《而已集》看到一半了～" },
      { plan: "周末看《而已集》的", time: "2019-04-01", checked:false, planDetail: "周末看《而已集》的第一章" },
    ]
  },

  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    // if (e.checked==true){

    // }else{
    //   e.checked: true,
    // }

    // this.setData({
    //   checked: false,
    // })
    console.log(this.data.items)
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

  },
  
  addPlan:function(){
    console.log("addPlan")
    wx.navigateTo({
      url: './planEdit/planEdit',
    })
  },

  editPlan: function () {
    console.log("editPlan")
    wx.navigateTo({
      url: './planEdit/planEdit',
    })
  },

  catchCheckboxChange:function(){
    //空函数，用于防止checkbox事件冒泡
  }
  
})