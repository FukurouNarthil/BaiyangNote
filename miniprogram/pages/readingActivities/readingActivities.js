const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      img: "./img/activity.png",
      text: "非遗阅读",
      url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
      collected: 0
    }, {
      img: "./img/activity.png",
        text: "新书速递",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0
    }, {
      img: "./img/activity.png",
        text: "爱心捐书",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0
    }, {
      img: "./img/activity.png",
        text: "感想漂流",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0
    }, {
      img: "./img/activity.png",
        text: "图书交换",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0
    }, {
      img: "./img/activity.png",
        text: "猜你喜欢",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0
    }],
    focus: false,
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.getUserCollection()
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  getUserCollection: function () {
    var that = this
    var list = that.data.list
    var c = []
    const db = wx.cloud.database()
    db.collection('user').doc(app.globalData.id).get({
      success: res=> {
        c = res.data.bookId_collection
        for(var i = 0; i < c.length; i++) {
          for(var j = 0; j < list.length; j++) {
            if(c[i].name==list[j].text&&c[i].url==list[j].url) {
              var item = "list[" + j + "].collected"
              that.setData({
                [item]: 1
              })
              break
            }
          }
        }
      },
      fail: console.err
    })
  },

  bindButtonTap: function() {
    this.setData({
      focus: true
    })
  },

  redirctToEventPage: function(e) {
    wx.navigateTo({
      url: '../eventPage/eventPage?url=' + e.currentTarget.dataset.eventurl,
    })
  },

  addCollection: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var obj = {
      'name': e.currentTarget.dataset.eventname,
      'url': e.currentTarget.dataset.eventurl
    }
    console.log(obj)
    wx.showModal({
      title: '提示',
      content: '确认收藏本活动',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var item = "list[" + index + "].collected"
          that.setData({
            [item]: 1
          })
          const db = wx.cloud.database()
          const _ = db.command
          db.collection('user').doc(app.globalData.id).update({
            data: ({
              bookId_collection: _.push(obj)
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})