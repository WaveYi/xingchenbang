// pages/huiyibang/browsePage/index.js
import {
  query_my_code_browse
} from '../../../api/user.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    infoList:[],
    list_title:"用户使用信息",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = {
      current: this.data.page,
      size: 100
    }
    console.log('---身份id---'+wx.getStorageSync('room_role'+wx.getStorageSync('room_id')))
    if(wx.getStorageSync('room_role'+wx.getStorageSync('room_id')) == 0){
      data.userId = wx.getStorageSync('userInfo').unionId
    }
    query_my_code_browse(data).then((res)=>{
      if(res.code == 200){
        this.setData({
          infoList: res.data.records
        })
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

  }
})