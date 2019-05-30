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
      collected: 0
    }, {
        img: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/bookRecommendation.png?sign=095cc12d5a5c203671e7da344d8d0e68&t=1559141019",
        text: "新书速递",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0
    }, {
        img: "https://7265-readingbook-bc6d6f-1258771595.tcb.qcloud.la/pic/notOpen.png?sign=9ae95b7863da7762474bc18087317b60&t=1559141521",
        text: "爱心捐书",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0
    }, {
        img: "./img/notOpen.png",
        text: "感想漂流",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0
    }, {
        img: "./img/notOpen.png",
        text: "图书交换",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0
    }, {
        img: "./img/notOpen.png",
        text: "猜你喜欢",
        url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
        collected: 0
    }, {
      img: "./img/notOpen.png",
      text: "热门阅读",
      url: "https://mp.weixin.qq.com/s/2w8hy3MJksb8ItvA7F-kPw",
      collected: 0
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
    var list = that.data.searchList
    var c = []
    const db = wx.cloud.database()
    db.collection('user').doc(app.globalData.id).get({
      success: res=> {
        c = res.data.bookId_collection
        for(var i = 0; i < c.length; i++) {
          for(var j = 0; j < list.length; j++) {
            if(c[i].name==list[j].text&&c[i].url==list[j].url) {
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
      'name': e.currentTarget.dataset.eventname,
      'url': e.currentTarget.dataset.eventurl
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
        } else if(res.cancel) {

        }
      }
    })
  },

  rmCollection: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var obj = {
      'name': e.currentTarget.dataset.eventname,
      'url': e.currentTarget.dataset.eventurl
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
    for(var i in this.data.searchList){
      var re = new RegExp(this.data.searchValue)
      if (re.test(this.data.searchList[i].text)){
        console.log(this.data.searchValue)
        console.log(this.data.searchList[i])
        sList.push(this.data.searchList[i])
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