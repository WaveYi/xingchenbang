import {
  qrCodeFileList,
  weseeAnalysis,
  queryVideoUrl,
  queryVideoUrl1
} from '../../api/qrCode.js'
import {
  get_video_link,
  get_video_link_not_log,
  queryOneMenu,
  addVote,
  queryVote,
  createProgramJoin,
  addTableUser,
  getCodeInfo,
  getTable,
  couponsellCoupon,
  addCodeBrowse,
  updateCodeCouponType
} from '../../api/user.js'
Page({
  data: {
    back_txt: '获取此优惠券',
    url: "",
    urlLisr: [],
    index: 0,
    is_from: 0,//嘉宾扫码进来是1
    menu_type: null,
    menu_id: '',//节目id
    compere_id: '',//节目主持人id
    is_choice: '',
    show: false,
    coupon_index: null,
    couponTypes: [
      {id:1,name: '天基权净空器'},
      {id:2,name: '舒博士多功能激光梳'},
      {id:3,name: 'GSLT半导体激光治疗仪'},
      {id:4,name: '天基权易康量子能量养生仪'},
      {id:5,name: '天基权易康闪电通'},
      {id:6,name: '天基权易康制氧机'}
    ],
    codeId: '',//绑定设备传的codeId
    is_has_more: 0,//是否有‘更多’按钮   0：没有   1：有
  },
  onLoad(options) {
    // console.log('111微信扫码接收'+JSON.stringify(options.q))
    var data = '';
    var is_yqh = '';
    console.log('-----options.q-----'+options.q)
    if(options.q){
      // 微信扫码
      //解析url地址
      let newUrl = decodeURIComponent(options.q);
      console.log('----微信扫码接收的参数newUrl----'+newUrl);
      data = newUrl.replace("https://h.3p3.top?data=","");
      is_yqh = data.indexOf("IdKey");
      //获取对应number参数
      // data = wx.getQueryString({
      //   url: newUrl,
      //   name: "data"
      // });
      // let data = res.result.replace("https://h.3p3.top?data=","");
      // console.log('----微信扫码接收的参数----'+newUrl); 
      console.log('---是否包含type---= '+is_yqh);
      console.log('----微信扫码接收的参数----'+data);
    }else{
      data = decodeURIComponent(wx.getStorageSync('params'));
      data = data.replace("https://h.3p3.top?data=","");
      is_yqh = data.indexOf("IdKey");
      console.log('---是否包含type---= '+is_yqh)
      console.log('扫码接收的参数'+decodeURIComponent(data));
      console.log('---二维码data的长度---'+data.length)
    }
    // let data = wx.getStorageSync('params');
    // console.log('扫码接收的参数'+data);

    if(wx.getStorageSync('check') == 1){
      if(is_yqh != -1){
        // 促销券视频
        console.log("----data1----"+data)
        let dataStr = data.split('&')[0];
        console.log("----data2----"+dataStr)
        queryVideoUrl({
          data: dataStr,
          loginMark: true
        }).then((res)=>{
          console.log('已登录调用的接口：'+JSON.stringify(res))
          if(res.code == 200){
            let newData = [];
            res.data.forEach(item => {
              newData.push(item)
            })
            this.setData({
              urlLisr: newData,
              url: newData[0]
            })
          }
        })
      }else{
        // 权益视频
        let room_id = '';
        if(wx.getStorageSync('room_id')){
          room_id = wx.getStorageSync('room_id')
        }else{
          room_id = '-1';
        }
        this.setData({
          is_has_more: 1,
          codeId: data.split(',')[2].substring(3)
        })
        get_video_link({
          roomId: room_id,
          menuId: this.data.menu_id,
          data: data
        }).then((res)=>{
          console.log('----视频列表----'+JSON.stringify(res))
          if(res.code == 200){
            let newData = [];
            res.data.forEach(item => {
              newData.push(item)
            })
            console.log('----视频列表newData----'+JSON.stringify(newData))
            console.log('----已登录扫码权益视频----'+JSON.stringify(res));
            this.setData({
              urlLisr: newData,
              url: newData[0]
            })
          }
        })
      }
    }else{
      if(is_yqh != -1){
        // 促销券视频
        console.log("----data1----"+data)
        let dataStr = data.split('&')[0];
        console.log("----data2----"+dataStr)
        queryVideoUrl({
          data: dataStr,
          loginMark: false
        }).then((res)=>{
          console.log('========未登录调用的接口=========：'+JSON.stringify(res))
          if(res.code == 200){
            let newData = [];
            res.data.forEach(item => {
              newData.push(item)
            })
            console.log('未登录调用的接口：'+JSON.stringify(newData))
            this.setData({
              urlLisr: newData,
              url: newData[0]
            })
          }
        })
      }else{
        // 权益视频
        this.setData({
          is_has_more: 1,
          codeId: data.split(',')[2].substring(3)
        })
        get_video_link({
          roomId: wx.getStorageSync('room_id'),
          menuId: this.data.menu_id,
          data: data
        }).then((res)=>{
          if(res.code == 200){
            let newData = [];
            res.data.forEach(item => {
              newData.push(item)
            })
            console.log('----未登录扫码权益视频----'+JSON.stringify(res));
            this.setData({
              urlLisr: newData,
              url: newData[0]
            })
          }
        })
      }
    }

    if(is_yqh == -1){
      console.log('---codeid---'+this.data.codeId)
      getCodeInfo({
        codeId: this.data.codeId
      }).then((res)=>{
        if(res.code == 200){
          console.log("---获取code信息---"+JSON.stringify(res))
          if(res.data!=null){
            if(res.data.couponType==null||res.data.couponType==''){
              // 未绑定设备
              this.setData({
                show: true
              })
            }else{
              // 已绑定了设备
            }
          }
        }
      })
    }
    return;
    if (options.data) {
      //解析url地址
      let newUrl = decodeURIComponent(options.data);
      //获取对应number参数
      let number = wx.getQueryString({
        url: newUrl,
        name: "number"
      });
      //请求接口
      this.queryVideo(number);
    } else {
      this.queryVideo(options.number);
    }
  },
  bindDevice(){
    if(this.data.coupon_index == null){
      wx.showToast({
        title: '请选择设备类型',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    updateCodeCouponType({
      codeId: this.data.codeId,
      couponType: this.data.coupon_index
    }).then((res)=>{
      if(res.code == 200){
        this.setData({
          show: false
        })
        wx.showModal({
          title: '提示',
          content: '绑定成功',
          showCancel: false
        })
      }
    })
  },
  bindPickerChange(e){
    this.setData({
      coupon_index: e.detail.value
    })
  },
  onClose(){
    this.setData({
      show: false
    })
  },
  onUnload(){
    wx.removeStorageSync('params');
  },
  queryVideo(number) {
    qrCodeFileList({
      quickResponseCodeNumber: number
    }).then(res => {
      console.log()
      let newData = [];
      res.data.forEach(item => {
        if (item.weseeLink && item.weseeLink != "") {
          newData.push(item.weseeLink)
        }
      })
      weseeAnalysis(newData).then(
        response => {
          let newUrl = [];
          response.data.forEach(item => {
            if (item.videoLink && item.videoLink != "") {
              newUrl.push(item.videoLink)
            }
          });
          this.setData({
            urlLisr: newUrl,
            url: newUrl[0]
          });
        }
      )
    })
  },
  nextVideo() {
    console.log("---视频数组---"+JSON.stringify(this.data.urlLisr))
    if (this.data.index == this.data.urlLisr.length - 1) {
      console.log("---第一个视频---"+this.data.index)
      this.setData({
        index: 0,
        url: this.data.urlLisr[0]
      })
    } else {
      console.log("---下一个视频---"+this.data.index)
      this.setData({
        index: this.data.index + 1,
        url: this.data.urlLisr[this.data.index + 1]
      })
    }
  },
  toAddVote(index){
    let that = this;
    let room_id = '';
    if(wx.getStorageSync('room_id')){
      room_id = wx.getStorageSync('room_id')
    }else{
      room_id = '-1';
    }
    console.log(room_id,that.data.menu_id,index,that.data.compere_id)
    addVote({
      roomId: room_id,
      menuId: that.data.menu_id,
      choice: index,
      userId: wx.getStorageSync('userInfo').unionId
      // compereUserId: that.data.compere_id
    }).then((res)=>{
      console.log(JSON.stringify(res))
      if(res.code == 200){
        wx.showToast({
          title: '投票成功',
          icon: 'none',
          duration: 1500
        })
      }
      setTimeout(()=>{
        if(that.data.from_type == 'click'){
          // 互动点击进来
          wx.navigateBack();
        }else{
          wx.switchTab({
            url: '/pages/userInfo/index'
          })
        }
      },1500)
    })
  },
  onClickLeft() {
    if(this.data.menu_type == 2){
      // 投票
      let that = this;
      if(this.data.is_choice == true){
        wx.showToast({
          title: '您已经投过票了',
          icon: 'none',
          duration: 1500
        })
        setTimeout(()=>{
          wx.navigateBack();
        },1500)
      }else{
        wx.showModal({
          title: "提示",
          content: "该节目需要您参与投票？",
          cancelText: "不支持",
          confirmText: "支持",
          success: function(res){
            if(res.confirm){
              that.toAddVote(0);
            }else{
              that.toAddVote(1);
            }
          }
        })
      }
    }else{
      if(this.data.from_type == 'click'){
        // 互动点击进来
        wx.navigateBack();
      }else{
        wx.switchTab({
          url: '/pages/userInfo/index'
        })
      }
    }
  },
  toMorePage(){
    wx.navigateTo({
      url: '/pages/huiyibang/menu/index?from=more'
    })
  }
})