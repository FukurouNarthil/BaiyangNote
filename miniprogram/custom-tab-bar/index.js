Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3A5103",
    list: [{
      pagePath: "../index/index",
      iconPath: "/images/home.png",
      selectedIconPath: "/images/selected_home.png",
      text: "首页"
    }, {
        pagePath: "../readingActivities/readingActivities",
        iconPath: "/images/recommend.png",
        selectedIconPath: "/images/selected_recommend.png",
        text: "阅读活动"
    }, {
        pagePath: "../calendar/calendar",
        iconPath: "/images/calendar.png",
        selectedIconPath: "/images/selected_calendar.png",
        text: "打卡日历"
    },
    {
      pagePath: "../myPage/myPage",
      iconPath: "/images/me.png",
      selectedIconPath: "/images/selected_me.png",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})



