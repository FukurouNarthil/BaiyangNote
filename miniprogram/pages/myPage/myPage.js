Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonGroup: [
      { name: "note", isClick: 0, imageUrl: 'img/note.png', imageUrl_selected: 'img/note_selected.png' },
      { name: "plan", isClick: 0, imageUrl: 'img/plan.png', imageUrl_selected: 'img/plan_selected.png' },
      { name: "collection", isClick: 0, imageUrl: 'img/collect.png', imageUrl_selected: 'img/collect_selected.png' },
      { name: "ranking", isClick: 0, imageUrl: 'img/rank.png', imageUrl_selected: 'img/rank_selected.png' },
      { name: "analysis", isClick: 0, imageUrl: 'img/analyze.png', imageUrl_selected: 'img/analyze_selected.png'}
    ],
    selectedIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 跳转到个人信息编辑页
   */
  toEditPage: function () {

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
    var self = this;
    var str = "buttonGroup[" + self.data.selectedIndex + "].isClick";
    self.setData({
      [str]: 0
    })
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

  // 页面跳转函数
  redirectToSubPage: function (e) {
    var self = this;
    var pageName = e.currentTarget.dataset.buttonname;
    var idx = e.currentTarget.dataset.idx;
    var str = "buttonGroup[" + idx + "].isClick";
    self.setData({
      [str]: 1,
      selectedIndex: idx
    })
    console.log(self.data)
    wx.navigateTo({
      url: '../me/' + pageName + '/' + pageName,
    })
  }
})