// // pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {
    step: 1,
    counterId: '',
    openid: '',
    count: null,
    queryResult: '',
  },

  nextStep: function () {
    console.log("this.data.step:" + this.data.step);    
    this.setData({
      step: this.data.step + 1
    });

  },

  prevStep: function () {
    console.log("this.data.step:" + this.data.step);    
    this.setData({
      step: this.data.step - 1
    })

  },

  test:function(){
    console.log("111")
  },

  goBack:function(){
    wx.navigateBack()
  }

})
