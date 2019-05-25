Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[{
      img:"./img/activity.png",
      text:"非遗阅读"
    },{
      img: "./img/activity.png",
        text: "新书速递"     
    }, {
      img: "./img/activity.png",
      text: "爱心捐书" 
    }, {
      img: "./img/activity.png",
      text: "感想漂流"
    }, {
      img: "./img/activity.png",
      text: "图书交换"
    }, {
      img: "./img/activity.png",
      text: "猜你喜欢"
    }],
    focus: false,
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }    
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

  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  }
})