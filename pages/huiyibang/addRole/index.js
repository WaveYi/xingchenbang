// pages/merchant/index.js
import {
  createRole,
  updateRole,
  getMeeting,
  getMeetingList
} from '../../../api/user.js'
import { base64src } from '../../../utils/base64src.js'
import publicFun from '../../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '申请角色',
    id: '',
    role_type: '2',
    is_edit: 0,//是否修改进来 0:不是  1:是
    items: [
      {value: '8', name: '新用户经理', checked: 'true'},
      {value: '9', name: '老用户经理'},
      {value: '10', name: '代理人'}
    ],
    remark: '',//站点名称
    roomId: '',
    farm_index: null,
    farms: [],
    is_form: 0,//个人中心申请角色：1
    logistics_index: null,
    logisticsTypes: [{name: '农场封装站点'},{name: '农场装车站点'},{name: '农场中转站点'},{name: '农场散货站点'}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.item){
      let items = JSON.parse(decodeURIComponent(options.item))
      this.setData({
        title: '修改角色',
        id: items.idKey,
        is_edit: 1
      })
      console.log(items)
    }

    if(options.from == 'user'){
      // 从个人中心申请角色
      this.setData({
        is_form: 1
      })
    }

    getMeetingList({}).then((res)=>{
      if(res.code == 200){
        this.setData({
          farms: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindLogChange(e){
    this.setData({
      logistics_index: e.detail.value
    })
  },
  bindPickerChange(e){
    this.setData({
      farm_index: e.detail.value,
      roomId: this.data.farms[e.detail.value].idKey
    })
  },
  radioChange(e){
    console.log(e.detail.value)
    this.setData({
      role_type: e.detail.value
    })
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
  getInputVal(e){
    let prams1 = e.target.dataset.key;
    this.setData({
      [prams1]: e.detail.value
    })
  },
  submitForm(e){
    var reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    // if(!reg.test(this.data.card)){
    //   wx.showToast({
    //     title: '请输入正确的身份证号码',
    //     icon: 'none'
    //   })
    //   return;
    // }
    if(this.data.is_form == 1){
      if(this.data.farm_index == null){
        publicFun.getToast('请选择公司');
        return;
      }
    }
    let data = {
      compereUserId: wx.getStorageSync('userInfo').unionId,
      userId: wx.getStorageSync('userInfo').unionId,
      roleType: this.data.role_type
    }
    if(this.data.is_form == 1){
      data.roomId = this.data.roomId
    }else{
      data.roomId = wx.getStorageSync('room_id')
    }
    if(this.data.role_type == 7){
      if(this.data.logistics_index == null){
        publicFun.getToast('请选择站点类型');
        return;
      }
      if(this.data.remark == ''){
        publicFun.getToast('请输入站点名称');
        return;
      }
      data.remark = this.data.remark;
      data.particle = this.data.logistics_index;
    }
    console.log('---申请role---data---'+JSON.stringify(data))
    if(this.data.is_edit == 1){
      data.idKey = this.data.id;
    }
    
    if(this.data.is_edit == 0){
      createRole(data).then(res=>{
        if(res.code == 200){
          if(res.data == '-1'){
            publicFun.getToast('你已经申请了该角色');
          }else{
            publicFun.getToast('提交成功');
            setTimeout(()=>{
              wx.navigateBack();
            },1500)
          }
        }
      })
    }else{
      updateRole(data).then(res=>{
        if(res.code == 200){
          publicFun.getToast('修改成功');
          setTimeout(()=>{
            wx.navigateBack();
          },1500)
        }
      })
    }
  }
})