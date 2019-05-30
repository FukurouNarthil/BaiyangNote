const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityList: [{
      img: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/cultureReading.png?sign=f322892f9cadb6de1879b7b31526cc6f&t=1559141459",
      text: "非遗阅读",
      url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
      collected: 0,
      abstract: '你所不知道的非遗~！'
    }, {
        img: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/bookRecommendation.png?sign=095cc12d5a5c203671e7da344d8d0e68&t=1559141019",
        text: "好书推荐",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0,
        abstract: '猫头鹰2018年度阅读~'
    }, {
        img: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/notOpen.png?sign=9ae95b7863da7762474bc18087317b60&t=1559141521",
        text: "爱心捐书",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0,
        abstract: '捐书献爱心~'
    }, {
        img: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/notOpen.png?sign=e304fa7ffe11b0ba883764b5c80cd4d6&t=1559222489",
        text: "感想漂流",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0,
        abstract: '读后感交流~'
    }, {
        img: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/notOpen.png?sign=e304fa7ffe11b0ba883764b5c80cd4d6&t=1559222489",
        text: "图书交换",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0,
        abstract: '以书会友！'
    }, {
        img: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/notOpen.png?sign=e304fa7ffe11b0ba883764b5c80cd4d6&t=1559222489",
        text: "猜你喜欢",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0,
        abstract: '你可能对这些书籍感兴趣喔~'
    }, {
        img: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/notOpen.png?sign=e304fa7ffe11b0ba883764b5c80cd4d6&t=1559222489",
        text: "新书速递",
      url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
      collected: 0,
      author: '最新面世的书籍！总有一本适合你~'
    }],
    // activityList:[],
    focus: false,
    inputValue: '',
    searchValue:'',
    searchList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    var that = this
    this.getUserCollection()
    this.setData({
      searchList: this.data.activityList
    })
    this.getUserCollection()
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
    var list = that.data.searchList
    var c = []
    const db = wx.cloud.database()
    db.collection('user').doc(app.globalData.id).get({
      success: res=> {
        c = res.data.bookId_collection
        for(var i = 0; i < c.length; i++) {
          for(var j = 0; j < list.length; j++) {
            if(c[i].title==list[j].text&&c[i].url==list[j].url) {
              var item = "searchList[" + j + "].collected"
              that.setData({
                [item]: 1
              })
              break
            }
          }
        }
        console.log(that.data.searchList)
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
      'title': e.currentTarget.dataset.eventname,
      'url': e.currentTarget.dataset.eventurl,
      'cover': e.currentTarget.dataset.cover,
      'abstract': e.currentTarget.dataset.abstract,
      'collect_time': '2019年5月30日'
    }
    console.log(obj)
    wx.showModal({
      title: '提示',
      content: '确认收藏本活动',
      success(res) {
        if (res.confirm) {
          var item = "searchList[" + index + "].collected"
          that.setData({
            [item]: 1
          })
          console.log(that.data.searchList)
          const db = wx.cloud.database()
          const _ = db.command
          db.collection('user').doc(app.globalData.id).update({
            data: ({
              bookId_collection: _.push(obj)
            })
          })
        }
      }
    })
  },

  rmCollection: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var obj = {
      'name': e.currentTarget.dataset.eventname,
      'url': e.currentTarget.dataset.eventurl,
      'cover': e.currentTarget.dataset.img,
      'abstract': e.currentTarget.dataset.abstract,
      'collect_time': '2019年5月30日'
    }
    wx.showModal({
      title: '提示',
      content: '确认取消收藏',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var item = "searchList[" + index + "].collected"
          that.setData({
            [item]: 0
          })
          const db = wx.cloud.database()
          const _ = db.command
          db.collection('user').doc(app.globalData.id).get({
            success: res => {
              var c = res.data.bookId_collection
              var i = c.indexOf(obj)
              c.splice(i, 1)
              console.log(c)
              db.collection('user').doc(app.globalData.id).update({
                data: ({
                  bookId_collection: c
                })
              })
            }
          })
        }
      }
    })
  },

  getTimeStamp: function () {

  },

  // inputBind:function(event){
  //   this.setData({
  //       searchValue:event.detail.value
  //   })
  //   console.log("bindInput")
  //   console.log(this.data.searchValue)
  // },

  search: function (event) {
    console.log("qqq")
    //点击搜索的时候，根据更新的list重新渲染页面
    this.setData({
      searchValue: event.detail.value
    })
    // console.log("bindInput")
    // console.log(this.data.searchValue)   
    this.match() 
  },

  //搜索关键字匹配,返回一个匹配的list
  match:function(){
    var sList = []
    for(var i in this.data.activityList){
      var re = new RegExp(this.data.searchValue)
      if (re.test(this.data.activityList[i].text)){
        console.log(this.data.searchValue)
        console.log(this.data.activityList[i])
        sList.push(this.data.activityList[i])
      }
    }
    console.log("sList:" + sList)    
    this.setData({
      searchList:sList
    })

    // var re = new RegExp("111")
    // console.log("re:" + re.test("111"))

  }

})