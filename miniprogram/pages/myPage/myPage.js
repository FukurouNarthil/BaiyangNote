const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    userName: '',
    logFlag: false,
    buttonGroup: [{
        name: "note",
        isClick: 0,
        imageUrl: 'img/note.png',
        imageUrl_selected: 'img/note_selected.png'
      },
      {
        name: "plan",
        isClick: 0,
        imageUrl: 'img/plan.png',
        imageUrl_selected: 'img/plan_selected.png'
      },
      {
        name: "collection",
        isClick: 0,
        imageUrl: 'img/collect.png',
        imageUrl_selected: 'img/collect_selected.png'
      },
      {
        name: "noRanking",
        isClick: 0,
        imageUrl: 'img/rank.png',
        imageUrl_selected: 'img/rank_selected.png'
      },
      {
        name: "dataAnalysis",
        isClick: 0,
        imageUrl: 'img/analyze.png',
        imageUrl_selected: 'img/analyze_selected.png'
      }
    ],
    selectedIndex: 0,
    description: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    //MyPages加载的时候请求用户授权
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            logFlag: true
          })
          this.onShow()
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    var self = this
    wx.showModal({
      title: '提示',
      content: '确认授权个人信息',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (e.detail.userInfo) {
            self.setData({
              avatarUrl: e.detail.userInfo.avatarUrl,
              userName: e.detail.userInfo.nickName,
              description: '点击头像设置个性签名',
              logFlag: true
            })
            const db = wx.cloud.database()
            db.collection('user').where({
              _openid: db.command.eq(app.globalData.openid)
            }).get({
              success: res => {
                console.log('成功')
                console.log(res.data)
                db.collection('user').doc(app.globalData.id).update({
                  data: ({
                    userName: e.detail.userInfo.nickName,
                    avatarUrl: e.detail.userInfo.avatarUrl,
                  })
                })
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '查询记录失败'
                })
                console.log('[数据库] [查询记录] 失败')
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 跳转到个人信息编辑页
   */
  toEditPage: function() {
    var self = this
    wx.navigateTo({
      url: '../infoEdit/infoEdit?avatarUrl=' + self.data.avatarUrl + '&username=' + self.data.userName + '&description=' + self.data.description,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }

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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var self = this;
    var str = "buttonGroup[" + self.data.selectedIndex + "].isClick";
    self.setData({
      [str]: 0
    })
  },

  // 页面跳转函数
  redirectToSubPage: function(e) {
    var self = this;
    var pageName = e.currentTarget.dataset.buttonname;
    var idx = e.currentTarget.dataset.idx;
    var str = "buttonGroup[" + idx + "].isClick";
    self.setData({
      [str]: 1,
      selectedIndex: idx
    })
    wx.navigateTo({
      url: '../me/' + pageName + '/' + pageName,
    })
  }
})