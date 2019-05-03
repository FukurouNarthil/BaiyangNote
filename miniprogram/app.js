//app.js
App({

  onLaunch: function () {

    this.globalData = {
      openid: ""
    }
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      }),

      // 调用云函数得到用户的openid
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          this.globalData.openid = res.result.openid
          this.openid = res.result.openid
          console.log('this.globalData是: ', this.globalData)
          wx.navigateTo({
            url: '../index/index',
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
          wx.navigateTo({
            url:  '../deployFunctions/deployFunctions',
          })
        }
      })

      //与数据库进行比对，插入一条初始化的用户记录
      const db = wx.cloud.database()
      // 查询一下数据库中有没有这个用户
      db.collection('user').where({
        // _openid: this.globalData.openid
        _openid: db.command.eq(this.globalData.openid)
      }).get({
        success: res => {
          // this.setData({
          //   queryResult: JSON.stringify(res.data, null, 2)
          // })
          console.log('成功')
          console.log("res.data.length:" + res.data.length)
          if (res.data.length==0){
            const db = wx.cloud.database()
            db.collection('user').add({
              data: {
                userName:"",
                avatarUrl:"",
                bookId_collection:[],
                bookId_favorite:[],
                checkin_days:[],
                description:"",
                noteId:[],
                planId:[],
                time_counter:[]
              },
              success: res => {
                // 在返回结果中会包含新创建的记录的 _id
                this.setData({
                  // counterId: res._id,
                  // count: 1
                })
                wx.showToast({
                  title: '新增记录成功',
                })
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '新增记录失败'
                })
                console.error('[数据库] [新增记录] 失败：', err)
              }
            })

          }else{
            //数据库中已经有这个用户了，那就什么也不做
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



    }

  }
})
