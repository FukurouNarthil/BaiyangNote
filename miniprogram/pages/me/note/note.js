const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    userName: "",
    list: [{
      src: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/book_cover/book_er_yi_ji.jpeg?sign=945d94bfc21246126cd7bd99031a2615&t=1559199295",
        title: "《而已集》",
        abstract:"人类的悲欢并不相通，我只觉得他们吵闹。" ,
        note: "人类的悲欢并不相通，我只觉得他们吵闹。" 
      }, { 
        src: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/book_cover/book_zai_xi_yu.jpeg?sign=64ca83eb82d93078effbd9b575a9a699&t=1559199361",
        title: "《在细雨中呼喊》",
        abstract:"现在眼前经常会出现模糊的幻觉，我似乎能够看到时间的流动。",
        note: "现在眼前经常会出现模糊的幻觉，我似乎能够看到时间的流动。时间呈现为透明的灰暗，所有一切都包孕在这隐藏的灰暗之中。我们并不是生活在土地上，事实上我们生活在时间里。田野、街道、河流、房屋是我们置身时间之中的伙伴。时间将我们推移向前或向后，并且改变着我们的模样。"
      }, {
        src: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/book_cover/book_tai_bei_ren.jpeg?sign=2b00d5198ec5ba6e82b65bbb21ca9ea7&t=1559199325",
        title: "《台北人》",
        abstract:"一切伟大功绩，一切荣华富贵，只能暂留，终归灭迹。所有欢都比钱物，所有并",
        note:"一切伟大功绩，一切荣华富贵，只能暂留，终归灭迹。所有欢都比钱物，所有并里别泪，所有喜悦，所有痛苦，到头来全是虚空一片，把带人都比钱能钱那为人生有限。人生是虚道地。一上多梦。一个没向忆。"
      }, {
        src: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/book_cover/book_wei_cheng.jpeg?sign=45dc2d2f0ab962a8cb09fc961a2ad74b&t=1559199343",
        title: "《围城》",
        abstract:"婚姻是一座围城，城外的人想进去，城里的人想出来。",
        note:"婚姻是一座围城，城外的人想进去，城里的人想出来。"
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

  },

  addNote:function(){
    console.log("addNote")
    wx.navigateTo({
      url: './noteEdit/noteEdit',
    })
  },

  editNote: function () {
    console.log("editNote")
    wx.navigateTo({
      url: './noteEdit/noteEdit',
    })
  },

})