// plugin/components/calendar/calendar.js
/**
 * 属性：
 * 01、year：年份：整型
 * 02、month：月份：整型
 * 03、day：日期：整型
 * 04、startDate：日历起点：字符串[YYYY-MM]
 * 05、endDate：日历终点：字符串[YYYY-MM]
 * 06、header：是否显示标题：布尔型
 * 07、next：是否显示下个月按钮：布尔型
 * 08、prev：是否显示上个月按钮：布尔型
 * 09、weeks：是否显示周标题：布尔型
 * 10、showMoreDays：是否显示上下月份的数字：布尔型
 * 11、lunar：是否显示农历 布尔型
 * 11、weeksType：周标题类型：字符串[en、full-en、cn]
 * 12、cellSize: 单元格大小 整型
 * 13、daysColor：设置日期字体、背景颜色
 * 14、activeType: 日期背景效果（正方形、圆形）[rounded, square]
 * 
 * 事件方法：
 * 1、nextMonth：点击下个月
 * 2、prevMonth：点击上个月
 * 3、dateChange: 日期选择器变化
 * 
 * 样式：
 * calendar-style 日历整体样式
 * header-style 标题样式
 * board-style 面板样式
 */

//const lunar = require('./lunar.js');
const minYear = 1900;
const maxYear = 2099;
const app = getApp()

Page({

  /**
   * 组件的初始数据
   */
  data: {
    days_array: [], // 日期数组
    days_color: [], // 日期字体、背景颜色数组
    days_addon: [], // 日期附件
    weekTitle: ['日', '一', '二', '三', '四', '五', '六'],
    max_year: 2099, // 最大年份
    max_month: 12,  // 最大月份
    min_year: 1900, // 最小年份
    min_month: 1,   // 最小月份 

    year: new Date().getFullYear(),
    month:new Date().getMonth() + 1,
    day:new Date().getDate(),
    startDate: '1900-01',
    endDate: '2099-12',
    header: true,//是否显示标题
    next: true,//是否显示下个月按钮
    prev: true,//是否显示上个月按钮
    showMoreDays: false,//显示额外上下月份日期
    weeks: true,//是否显示周标题
    weeksType: 'ch',//周标题类型
    daysColor: [],//设置日期字体、背景颜色
    cellSize: 30,//单元格大小
    activeType: 'rounded',//设置日期背景效果
    //lunar:false,//是否显示农历
    addon: 'none',//额外选项
    daysAddon: [],//日期附加选项 

    countDays:0,//记录打卡天数
    allDays:[]     
  },

  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function () {
    this.onQueryDays();
    this._setCalendarData(this.data.year, this.data.month);
    console.log("对日历进行初始化完成");
    console.log("this.data.allDays:" + this.data.allDays);
  },

  onQueryDays: function () {
    
    const db = wx.cloud.database()
    //console.log('app.globalData.openid:'+ app.globalData.openid)
    // 查询当前所有用户的信息
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        console.log('查询到了打卡总天数')
        console.log('res.data[0].checkin_days.length:' + res.data[0].checkin_days.length)
        this.setData({
          countDays: res.data[0].checkin_days.length,
          allDays: res.data[0].checkin_days
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
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

  /**
   * 设置日历
   * @param int year 年份
   * @param int month 月份，取值1~12
   */
  _setCalendarData: function (year, month) {
    const empty_days_count = new Date(year, month - 1, 1).getDay(); // 本月第一天是周几，0是星期日，6是星期六
    let empty_days = new Array;
    const prev_month = month - 1 == 0 ? 12 : month - 1;             // 上个月的月份数
    const prev_year = month - 1 == 0 ? this.data.year - 1 : this.data.year;
    /**
     * 上个月的日期
     */
    for (let i = 0; i < empty_days_count; i++) {
      empty_days.push({
        state: 'inactive',
        day: -1,
        month: prev_month,
        year: prev_year,
        info: 'prev',
        color: '#c3c6d1',
        background: 'transparent'
      });
    }

    /**
     * 下个月的日期
     */
    const last_day = new Date(year, month, 0);          // 本月最后一天
    const days_count = last_day.getDate();              // 本月最后一天是几号
    const last_date = last_day.getDay();                // 本月最后一天是星期几
    const next_month = month + 1 == 13 ? 1 : month + 1; // 下个月的月份数
    const next_year = month + 1 == 13 ? this.data.year + 1 : this.data.year;
    let empty_days_last = new Array;
    for (let i = 0; i < 6 - last_date; i++) {
      empty_days_last.push({
        state: 'inactive',
        day: -2,
        month: next_month,
        year: next_year,
        info: 'next',
        color: '#c3c6d1',
        background: 'transparent'
      });
    }

    /**
     * 本月的日期
     */
    let temp = new Array;
    for (let i = 1; i <= days_count; i++) {
      temp.push({
        state: 'inactive',
        day: i,
        month: month,
        year: year,
        info: 'current',
        color: '#4a4f74',
        background: 'transparent'
      });
    }
    const days_range = temp;                                   // 本月
    var days = empty_days.concat(days_range, empty_days_last); // 上个月 + 本月 + 下个月            
    // 如果要显示前后月份的日期
    if (this.data.showMoreDays) {
      // 显示下月的日期
      let index = days.findIndex(element => { return element.day == -2; });
      if (index != -1) {
        const length = days.length;
        const count = length - index;
        for (let i = 1; i <= count; i++) {
          days[index + i - 1].day = i;
        }
      }

      // 显示上月的日期
      index = days.findIndex(element => { return element.day == 1; }) - 1;
      if (index != -1) {
        const last_month_day = new Date(year, month - 1, 0).getDate();
        for (let i = 0; i <= index; i++) {
          days[i].day = last_month_day - index + i;
        }
      }
    }

    //每次加载页面都更新一下days_color数组，每次都整个数组 删掉重新开始更新
    var days_color = new Array;
    var allDays = this.data.allDays;
    if (this.data.month == new Date().getMonth() + 1){
      days_color.push({
        month: "current", day: this.data.day, color: 'white', background: '#486a00'
      });
    }


    // 查询当前所有用户的信息
    const db = wx.cloud.database()
    
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        this.setData({
          //countDays: res.data[0].checkin_days.length,
          allDays: res.data[0].checkin_days
        })
        
        allDays = this.data.allDays;
        console.log('allDays:' + allDays);
        for (let i = 0; i < allDays.length; i++) {
          console.log('allDays.length:' + allDays.length);
          console.log('i:' + i);
          var tempDay = allDays[i].getDate();
          var tempMonth = allDays[i].getMonth()+1;
          console.log('tempDay,tempMonth:' + tempDay+","+tempMonth);
          if (tempMonth == this.data.month && tempDay!=this.data.day) {
            console.log("hihihi");
            days_color.push({
              month: 'current', day: tempDay, color: '#486a00', background: '#e5e5e5'
            });
          }else{}
        }
        console.log(days_color);
        this.setData({
          days_color:days_color
        });
        /**
       * 设置日期颜色、背景
       */
        for (let i = 0; i < this.data.days_color.length; i++) {
          console.log("设置颜色:" + this.data.days_color.length);
          const item = this.data.days_color[i];
          const background = item.background ? item.background : 'transparent';
          console.log("days.length:"+days.length);
          for (let j = 0; j < days.length; j++) {
            if (days[j].info == item.month && days[j].day == item.day) {
              if (item.color) {
                days[j].color = item.color + '!important';
              }
              if (item.background) {
                days[j].background = item.background + '!important';
              }
            }
          }
        }

        let days_array = new Array;
        let week = new Array;
        for (let i = 0; i < days.length; i++) {
          week.push(days[i]);
          if (i % 7 == 6) {
            days_array.push(week);
            week = new Array;
          }
        }

        if (week.length > 0) {
          days_array.push(week);
        }

        this.setData({
          days_array: days_array
        });

        return this.data.days_array;

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err);
        return null;
      },

    })

  },


  /**
   * 点击下个月
   */
  nextMonth: function () {
    const eventDetail = {
      prevYear: this.data.year,
      prevMonth: this.data.month
    };

    if (this.data.month == 12) {
      this.setData({
        year: this.data.year + 1,
        month: 1
      });
    } else {
      this.setData({
        month: this.data.month + 1
      });
    }
    this.setData({
      days_array: this._setCalendarData(this.data.year, this.data.month)
    });
    eventDetail['currentYear'] = this.data.year;
    eventDetail['currentMonth'] = this.data.month;
    this.triggerEvent('nextMonth', eventDetail);
  },

  /**
   * 点击上个月
   */
  prevMonth: function () {
    const eventDetail = {
      prevYear: this.data.year,
      prevMonth: this.data.month
    };

    if (this.data.month == 1) {
      this.setData({
        year: this.data.year - 1,
        month: 12
      });
    } else {
      this.setData({
        month: this.data.month - 1
      })
    }
    this.setData({
      days_array: this._setCalendarData(this.data.year, this.data.month)
    });
    eventDetail['currentYear'] = this.data.year;
    eventDetail['currentMonth'] = this.data.month;
    this.triggerEvent('prevMonth', eventDetail);
  },

  /**
   * 日期选择器变化
   */
  dateChange: function (event) {
    const eventDetail = {
      prevYear: this.data.year,
      prevMonth: this.data.month
    };
    const value = event.detail.value;
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    this.setData({
      year: year,
      month: month,
      days_array: this._setCalendarData(year, month)
    });

    eventDetail['currentYear'] = year;
    eventDetail['currentMonth'] = month;
    this.triggerEvent('dateChange', eventDetail);
  },

  /**
   * 点击具体日期
   */
  dayClick: function (event) {
    const click_day = event.currentTarget.dataset.day;
    const eventDetail = {
      year: click_day.year,
      month: click_day.month,
      day: click_day.day,
      color: click_day.color,
      lunarMonth: click_day.lunarMonth,
      lunarDay: click_day.lunarDay,
      background: click_day.background
    };
    this.triggerEvent('dayClick', eventDetail);
  },
  

  created: function () {
  },

  attached: function () {
    const year = this.data.year;
    const month = this.data.month;
    this.setData({
      days_array: this._setCalendarData(year, month)
    });
  },

  ready: function () {
  },

})
