 // pages/huiyibang/meeting/index.js
import {
  getRoomRoleUserList,
  queryBusinessInfo,
  couponConsume,
  verifySellCoupon,
  getRoleList,
  updateCodeInfoContent,
  queryRegistr,
  getUserToTable,
  getTableInfoByUserId,
  emptyRoomRole,
  queryOneMenu,
  getMenuVideoParseLink,
  querySellSuccessCouponList,
  sellaccept,
  getAgentCoupon1,
  getCouponsell,
  query_company_code_type,
  pushMenuVideoLinkToCodeType,
  createCodeLogisticsRecord,
  createParentTypeCode,
  createRelationByTypeId,
  createCodeSceneVide,
  updateCodeCouponType
} from '../../../api/user.js'
import {
  show_user_company_id,
  query_company_img,
  company_sell_code,
  get_company_info
} from '../../../api/qqhh_user.js'
import { base64src } from '../../../utils/base64src.js'
import publicFun from '../../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back_img: '',
    array: [],
    index: 0,
    meetings: [],
    room_id: '',
    role_list: [],
    identity: '',//用户角色
    room_identity: 0,//房间角色
    log_identity: 0,
    show: false,  //显示公司二维码
    company_code: '', //公司二维码图片
    userinfo_show: false,//显示嘉宾签到签退信息
    table_show: false,
    table_dataStr: '',
    table_num: '',//绑定的桌号
    jb_table_num: '',//嘉宾桌子号
    jiabinInfo: {},//嘉宾信息
    is_has_table: false,//是否有桌子号
    jb_status: '签到',
    couponSellIdKey: '',//当前会议的促销券id
    // 权益分类
    page1: 1,
    show1: false,
    show2: false,
    is_checked: false,
    project_list: [],
    new_type_id: '',//选择的项目id
    type_count: '',//选择的项目权益数量
    big_code: '',//车二维码
    videoLinks: [{name: '视频1',videoLink: ''}],
    coupon_index: null,
    couponTypes: [
      {id:1,name: '天基权净空器'},
      {id:2,name: '舒博士多功能激光梳'},
      {id:3,name: 'GSLT半导体激光治疗仪'},
      {id:4,name: '天基权易康量子能量养生仪'},
      {id:5,name: '天基权易康闪电通'},
      {id:6,name: '天基权易康制氧机'}
    ],
    codeId: ''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if(user_identity == 0 || user_identity == null || user_identity == undefined){
    //   // 普通用户
    //   meeting_list = [
    //     {icon: '/assets/icon/23.png',title: '注册公司'},
    //     // {icon: '/assets/icon/6.png',title: '搜索公司'}
    //   ]
    // }else{
      
    // }
  },
  addVideo(){
    if(this.data.videoLinks.length >= 9){
      publicFun.getToast('最多上传9个视频');
      return;
    }
    let len = this.data.videoLinks.length+1;
    this.data.videoLinks.push({
      name: '视频'+len,
      videoLink: ''
    })
    this.setData({
      videoLinks: this.data.videoLinks
    })
  },
  addVideoLink(e){
    let index = e.currentTarget.dataset.index;
    this.data.videoLinks[index].videoLink = e.detail.value;
    this.setData({
      videoLinks: this.data.videoLinks
    })
  },
  showPopup() {
    this.setData({ show: true });
  },
  showInfoPopup(){
    this.setData({ userinfo_show: true })
  },
  onClose() {
    this.setData({ show: false, show3: false, userinfo_show: false, table_show: false });
  },
  bindPickerShowChange(e){
    this.setData({
      coupon_index: e.detail.value
    })
  },
  getProjectList(){
    query_company_code_type({
      current: this.data.page1,
      size: 20
    }).then((res)=>{
      if(res.code == 200){
        if(this.data.page1 == 1){
          console.log(JSON.stringify(res.data.records))
          if(res.data.records.length == 1){
            this.setData({
              new_type_id: res.data.records[0].typeId
            })
          }
          this.setData({
            project_list: res.data.records
          })
        }else{
          this.setData({
            project_list: this.data.project_list.concat(res.data.records)
          })
        }
        this.setData({
          show1: true
        })
      }
    })
  },
  loadMore(){
    this.data.page1++;
    this.setData({
      page1: this.data.page1
    })
    this.getProjectList();
  },
  selectProject(e){
    console.log(e.detail.value,this.data.project_list[e.detail.value].typeId,this.data.project_list[e.detail.value].codeNumber)
    this.setData({
      new_type_id: this.data.project_list[e.detail.value].typeId,
      type_count: this.data.project_list[e.detail.value].codeNumber
    })
  },
  onClose1(){
    this.setData({
      show1: false
    })
  },
  onClose2(){
    this.setData({
      videoLinks: [{name: '视频1',videoLink: ''}],
      show2: false
    })
  },
  editVideo(){
    var that = this;
    for(let i in this.data.videoLinks){
      if(this.data.videoLinks[i].videoLink == ''){
        publicFun.getToast('请至少输入一个视频地址');
        return;
      }
    }
    for(let i in this.data.videoLinks){
      if(this.data.videoLinks[i].videoLink.indexOf('challenge') != '-1'){
        // 微视挑战类型视频转换
        let cs_id = this.data.videoLinks[i].videoLink.split('&')[0].split('=')[1];
        let all_cs = this.data.videoLinks[i].videoLink.split('?')[1];
        this.data.videoLinks[i].videoLink = 'https://h5.weishi.qq.com/weishi/feed/'+ cs_id + '/wsfeed?' + all_cs
      }
	  
      if(this.data.videoLinks[i].videoLink.indexOf('isee.weishi') != '-1'){
        // 微视isee类型视频转换
        let cs_id = this.data.videoLinks[i].videoLink.split('&')[1].split('=')[1];
        let all_cs = this.data.videoLinks[i].videoLink.split('?')[1];
        this.data.videoLinks[i].videoLink = 'https://h5.weishi.qq.com/weishi/feed/'+ cs_id + '/wsfeed?' + all_cs
      }
    }
    this.setData({
      show2: false
    })
    wx.scanCode({
      success(res) {
        console.log('扫码返回的参数: '+JSON.stringify(res.result));
        // console.log('截取字符串后：'+res.result.replace("https://h.3p3.top?data=",""))
        let data = res.result.replace("https://h.3p3.top?data=","");
        let codeNumber = data.split(',')[2].split('=')[1];
        console.log('---codeNumber: '+codeNumber);
        let videoList = [];
        for(let i=0;i<that.data.videoLinks.length;i++){
          console.log('---视频url---'+that.data.videoLinks[i].videoLink)
          videoList.push(that.data.videoLinks[i].videoLink)
        }
        console.log('---videoList: '+videoList.toString());
        createCodeSceneVide({
          linkList: videoList.toString(),
          codeNumber: codeNumber
        }).then((res)=>{
          if(res.code == 200){
            wx.showModal({
              title: '提示',
              content: '扫描成功',
              showCancel: false
            })
            that.scanSell(codeNumber,res.result);
          }
        })
      }
    })
  },
  selectConfirm(){
    if(this.data.new_type_id == ''){
      wx.showToast({
        title: '请先选择项目',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    // if(this.data.type_count == 0){
    //   wx.showToast({
    //     title: '暂无权益',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return;
    // }
    this.sendVideo();
  },
  sendVideo(){
    this.setData({
      show1: false
    })
    var that = this;
    wx.scanCode({
      success(res) {
        console.log('扫码返回的参数: '+JSON.stringify(res.result));
        // console.log('截取字符串后：'+res.result.replace("https://h.3p3.top?data=",""))
        let data = res.result.replace("https://h.3p3.top?data=","");
        let codeNumber = data.split(',')[2].split('=')[1];
        console.log(that.data.new_type_id+'---codeNumber: '+codeNumber);
        createParentTypeCode({
          codeTypeId: that.data.new_type_id,
          codeNumber: codeNumber
        }).then((res)=>{
          if(res.code == 200){
            console.log(JSON.stringify(res))
            wx.showModal({
              title: '提示',
              content: '装箱成功',
              showCancel: false
            })
            that.scanSell(codeNumber,res.result);
          }
        })
      }
    })
  },
  getRoleInit(){
    console.log(this.data.room_identity);
    let meeting_list = [];
    if(this.data.room_identity == 3){
      // 嘉宾
      meeting_list = [
        {
          title: '代理邀请管理',
          icon: '/assets/hyb/hyb2.png'
        },
        {
          title: '角色申请',
          icon: '/assets/hyb/hyb13.png'
        }
      ]
    }else if(this.data.room_identity == 1){
      // 烟草老板
      meeting_list = [{
        title: '查看角色申请',
        icon: '/assets/hyb/hyb1.png'
      },{
        title: '促销券管理',
        icon: '/assets/hyb/hyb2.png'
      },{
        title: '宏观视角',
        icon: '/assets/hyb/hyb3.png'
      },{
        title: '我的视频权益',
        icon: '/assets/hyb/hyb4.png'
      },{
        title: '权益接收',
        icon: '/assets/hyb/hyb5.png'
      },{
        title: '修改公司信息',
        icon: '/assets/hyb/hyb6.png'
      }]
    }else if(this.data.room_identity == 8){
      // 新用户经理
      meeting_list = [
        {
          title: '审批',
          icon: '/assets/hyb/hyb1.png'
        },{
          title: '视频权益列表',
          icon: '/assets/hyb/hyb4.png'
        },{
          title: '权益接收',
          icon: '/assets/hyb/hyb5.png'
        },{
          title: '视频列表',
          icon: '/assets/hyb/hyb4.png'
        },{
          title: '销售',
          icon: '/assets/hyb/hyb11.png'
        },{
          title: '验证',
          icon: '/assets/hyb/hyb11.png'
        },{
          title: '扫码绑定类型',
          icon: '/assets/hyb/hyb11.png'
        }
      ]
    }else if(this.data.room_identity == 9){
      // 老用户经理
      meeting_list = [
        {
          title: '审批',
          icon: '/assets/hyb/hyb1.png'
        },{
          title: '视频权益列表',
          icon: '/assets/hyb/hyb4.png'
        },{
          title: '权益接收',
          icon: '/assets/hyb/hyb5.png'
        },{
          title: '视频列表',
          icon: '/assets/hyb/hyb4.png'
        },{
          title: '销售',
          icon: '/assets/hyb/hyb11.png'
        },{
          title: '验证',
          icon: '/assets/hyb/hyb11.png'
        }
      ]
    }else if(this.data.room_identity == 4){
      // 销售员
      meeting_list = [
      {
        title: '销售',
        icon: '/assets/hyb/hyb11.png'
      },{
        title: '验证',
        icon: '/assets/hyb/hyb11.png'
      },
      {
        title: '角色申请',
        icon: '/assets/hyb/hyb13.png'
      }]
    }else if(this.data.room_identity == 5){
      // 嘉宾邀请
      meeting_list = [{
        title: '角色申请',
        icon: '/assets/hyb/hyb13.png'
      },{
        title: '登记信息管理',
        icon: '/assets/hyb/hyb9.png'
      },]
    }else if(this.data.room_identity == 6){
      // 会议观察员
      meeting_list = [{
        title: '节目进程查看',
        icon: '/assets/hyb/hyb7.png'
      },{
        title: '查看角色申请',
        icon: '/assets/hyb/hyb1.png'
      },{
        title: '宏观视角',
        icon: '/assets/hyb/hyb3.png'
      },{
        title: '角色申请',
        icon: '/assets/hyb/hyb13.png'
      },{
        title: '登记信息管理',
        icon: '/assets/hyb/hyb9.png'
      },]
    }else if(this.data.room_identity == 7){
      // 物流站点
      if(this.data.log_identity == 0){
        // 物流封装站点
        meeting_list = [
          {
            title: '物流装箱',
            icon: '/assets/hyb/hyb12.png'
          },{
            title: '我的视频权益',
            icon: '/assets/hyb/hyb4.png'
          },{
            title: '权益接收',
            icon: '/assets/hyb/hyb5.png'
          },
        ]
      }else if(this.data.log_identity == 1){
        // 物流装车站点
        meeting_list = [
          {
            title: '扫车二维码',
            icon: '/assets/hyb/hyb12.png'
          },
          {
            title: '扫箱子二维码',
            icon: '/assets/hyb/hyb12.png'
          },
        ]
      }else if(this.data.log_identity == 2){
        // 物流中转站点
        meeting_list = [
          {
            title: '创建站点',
            icon: '/assets/hyb/hyb12.png'
          },
        ]
      }else if(this.data.log_identity == 3){
        // 物流散货站点
        meeting_list = [
          {
            title: '物流散货',
            icon: '/assets/hyb/hyb12.png'
          },
        ]
      }
    }
    this.setData({
      meetings: meeting_list
    })
    wx.removeStorageSync('user_update')
  },
  showBossCode(){
    show_user_company_id().then((res)=>{
      if(res.code == 200){
        const base64ImgUrl = "data:image/png;base64," + res.data;
        this.setData({
          company_code: base64ImgUrl
        })
        // base64src(base64ImgUrl,'comCode',ress=>{
          
        // })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  getUserRoleList(){
    queryBusinessInfo({}).then(resq=>{
      if(resq.code == 200){
        if(resq.data != null && resq.data.status == '待审批'){
          return;
        }
        console.log('userId-------'+wx.getStorageSync('userInfo').unionId)
        getRoomRoleUserList({
          roomId: wx.getStorageSync('room_id'),
          userId: wx.getStorageSync('userInfo').unionId,
          status: 2
        }).then((res)=>{
          if(res.code == 200){
            let role_list = [];
            let array = [];
            let room_role = 0;
            let log_role = 0;
            let data = [];
            // console.log('----data----'+JSON.stringify(data))
            if(res.data.length != 0){
              if(res.data.length > 1){
                for(let i in res.data){
                  if(res.data[i].roleType != 0){
                    data.push(res.data[i])
                  }
                }
              }else{
                data = res.data;
              }
              console.log('---data[0].status---'+data[0].status)
              console.log('----data[0]----'+JSON.stringify(data[0]))
              wx.setStorageSync('boss_id', data[0].userId)
              wx.setStorageSync('compereUserId', data[0].compereUserId)//农场老板id
              wx.setStorageSync('room_id', data[0].roomId)
              wx.setStorageSync('room_role'+data[0].roomId, data[0].roleType)//农场角色
              wx.setStorageSync('back_img', data[0].meetingRoom.roomImg)
              wx.setStorageSync('remark', data[0].roleRemark)
              wx.setStorageSync('log_role'+data[0].roomId, data[0].particle)//物流站点角色
              room_role = wx.getStorageSync('room_role'+data[0].roomId);
              log_role = wx.getStorageSync('log_role'+data[0].roomId);
              console.log('----room_role----'+wx.getStorageSync('room_role'+data[0].roomId))
              this.setData({
                room_identity: room_role,
                log_identity: log_role
              })
              console.log('----room_role----'+this.data.room_identity)
              console.log('----log_role----'+this.data.log_identity)
              this.getRoleInit();
              if(data[0].roleType == 3){
                array = ['代理人'];
                role_list = [3];
              }else if(data[0].roleType == 1){
                array = ['店铺老板','新用户经理','老用户经理'];
                role_list = [1,8,9];
              }else if(data[0].roleType == 2){
                array = ['新用户经理','老用户经理'];
                role_list = [8,9];
              }
            }else{
              wx.removeStorageSync('room_id');
              wx.removeStorageSync('room_role'+wx.getStorageSync('room_id'));
              wx.removeStorageSync('back_img');
            }
            // array = ['农场老板','农场经理','代理人','销售员','消费者'];
            // role_list = [1,2,3,4,0];
            this.setData({
              role_list: role_list,
              array: array
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(wx.getStorageSync('check') == 1){
      console.log('进入1')
      console.log(wx.getStorageSync('room_id'))
      console.log(wx.getStorageSync('user_update'))
      if(wx.getStorageSync('user_update')){
        this.getRoomInvite();
        this.getUserRoleList();
        this.updateRole();
      }
    }else{
      console.log('进入2')
      wx.removeStorageSync('room_id');
      wx.removeStorageSync('back_img');
    }
    this.setData({
      room_id: wx.getStorageSync('room_id')
    })
  },
  getRoomInvite(){
    let data = {
      pageNum: this.data.page,
      pageSize: 20,
      couponType: 0,
      accept: 1,
      consumerId: wx.getStorageSync('userInfo').unionId
    }
    querySellSuccessCouponList(data).then(lookres=>{
      if(lookres.code == 200){
        if(lookres.data.length!=0){
          this.setData({
            couponSellIdKey: lookres.data[0].couponSellIdKey
          })
        }
      }
    })
  },
  getTableId(userId){
    getTableInfoByUserId({
      unionId: userId
    }).then((res)=>{
      if(res.code == 200){
        console.log('----获取用户桌子id----'+JSON.stringify(res))
        if(res.data != null){
          this.setData({
            jb_table_num: res.data
          })
        }
      }
    })
  },
  getTableNum(e){
    this.setData({
      table_num: e.detail.value
    })
  },
  confirmTableNum(){
    console.log('桌号----'+this.data.table_num,this.data.table_dataStr)
    updateCodeInfoContent({
      content: this.data.table_num,//桌号
      data: this.data.table_dataStr//要购买的促销劵二维码
    }).then(resg=>{
      console.log('绑定成功：'+JSON.stringify(resg));
      if(resg.code == 200){
        console.log(JSON.stringify(resg));
        this.setData({
          table_show: false
        })
        wx.showModal({
          title: "提示",
          content: "绑定成功！",
          showCancel: false
        })
      }
    })
  },
  updateRole(){
    let room_id = wx.getStorageSync('room_id');
    console.log('----房间id----'+room_id)
    console.log('----房间身份id----'+wx.getStorageSync('room_role'+room_id))
    console.log('----index----'+wx.getStorageSync('index'+room_id))
    if(wx.getStorageSync('index'+room_id)){
      this.setData({
        index: wx.getStorageSync('index'+room_id)
      })
    }else{
      this.setData({
        index: 0
      })
    }
    if(wx.getStorageSync('room_role'+room_id)){
      wx.setStorageSync('room_role'+room_id, wx.getStorageSync('room_role'+room_id))
    }else{
      wx.setStorageSync('room_role'+room_id, 0)
    }
    let user_identity = wx.getStorageSync('userInfo').type;//用户角色
    let room_identity = wx.getStorageSync('room_role'+room_id);//房间角色
    let back_img = wx.getStorageSync('back_img');
    this.setData({
      room_id: room_id,
      identity: user_identity,
      // room_identity: room_identity,
      back_img: back_img
    })
    // this.getRoleInit();
  },
  clickMeetingItem(e){
    let click_idx = e.currentTarget.dataset.index;
    if(this.data.room_identity == 0){
      // 用户
      if(click_idx == 0){
        wx.navigateTo({
          url: '/pages/promotion/index'
        })
      }
      else if(click_idx == 1){
        // 房间权限申请
        console.log(JSON.stringify(this.data.role_list))
        if(this.data.role_list.length==1 && this.data.role_list[0]==0){
          // 只有嘉宾身份
          wx.navigateTo({
            url: '/pages/huiyibang/addRole/index'
          })
        }else{
          wx.navigateTo({
            url: '/pages/huiyibang/roleList/index?type=0'
          })
        }
      }
    }else if(this.data.room_identity == 1){
      // 农场老板
      if(click_idx == 0){
        //查看农场 /pages/huiyibang/checkConferenceRoom/index
        wx.navigateTo({
          url: '/pages/huiyibang/roleList/index?type=1',
        })
      }else if(click_idx == 1){
        // 促销券管理
        wx.navigateTo({
          url: '/pages/promotion/index'
        })
      }else if(click_idx == 2){
        // 农场宏观视角
        wx.navigateTo({
          url: '/pages/huiyibang/Browse/index'
        })
      }else if(click_idx == 3){
        // 我的视频权益
        wx.navigateTo({
          url: '/pages/qinqinhehe/videoInterests/index?type=1'
        })
      }else if(click_idx == 4){
        // 权益接收
        this.showBossCode();
        this.setData({
          show: true
        })
      }else{
        // 修改农场信息
        wx.navigateTo({
          url: '/pages/merchant/index?is_edit=1'
        })
      }
    }else if(this.data.room_identity == 8){
      // 新用户经理
      if(click_idx == 0){
        //新用户审批
        wx.navigateTo({
          url: "/pages/huiyibang/userApprove/index"
        })
      }else if(click_idx == 1){
        // 视频权益列表
        wx.navigateTo({
          url: '/pages/qinqinhehe/videoInterests/index?type=2'
        })
      }else if(click_idx == 2){
        // 权益接收
        this.showBossCode();
        this.setData({
          show: true
        })
      }else if(click_idx == 3){
        wx.navigateTo({
          url: "/pages/huiyibang/menu/index"
        })
      }else if(click_idx == 4){
        // 销售
        wx.scanCode({
          success(res) {
            console.log('扫码返回的参数: '+JSON.stringify(res));
            // console.log('截取字符串后：'+res.result.replace("https://h.3p3.top?data=",""))
            let data = res.result.replace("https://h.3p3.top?data=","");
            let dataStr = JSON.parse(data.split('&')[0]).couponSellIdKey;
            console.log('---促销券idkey---'+dataStr)
            sellaccept({
              accept: 1,
              idKey: dataStr //this.data.couponId
            }).then((ress)=>{
              if(ress.code == 200){
                wx.showModal({
                  title: '提示',
                  content: '出售成功',
                  showCancel: false
                })
              }
            })
          }
        })
      }else if(click_idx == 5){
        // 验证
        this.signInOut()
      }else{
        // 扫码绑定类型
        let that = this;
        wx.scanCode({
          success(res) {
            console.log('扫码返回的参数: '+JSON.stringify(res));
            // console.log('截取字符串后：'+res.result.replace("https://h.3p3.top?data=",""))
            let data = res.result.replace("https://h.3p3.top?data=","");
            console.log('---促销券idkey---'+data)
            that.setData({
              codeId: data.split(',')[2].substring(3),
              show3: true
            })
          }
        })
      }
    }else if(this.data.room_identity == 9){
      // 老用户经理
      if(click_idx == 0){
        //老用户审批
        wx.navigateTo({
          url: "/pages/huiyibang/userApprove/index"
        })
      }else if(click_idx == 1){
        // 视频权益列表
        wx.navigateTo({
          url: '/pages/qinqinhehe/videoInterests/index?type=2'
        })
      }else if(click_idx == 2){
        // 权益接收
        this.showBossCode();
        this.setData({
          show: true
        })
      }else if(click_idx == 3){
        wx.navigateTo({
          url: "/pages/huiyibang/menu/index"
        })
      }else if(click_idx == 4){
        // 销售
        wx.scanCode({
          success(res) {
            console.log('扫码返回的参数: '+JSON.stringify(res));
            // console.log('截取字符串后：'+res.result.replace("https://h.3p3.top?data=",""))
            let data = res.result.replace("https://h.3p3.top?data=","");
            let dataStr = JSON.parse(data.split('&')[0]).couponSellIdKey;
            console.log('---促销券idkey---'+dataStr)
            sellaccept({
              accept: 1,
              idKey: dataStr //this.data.couponId
            }).then((ress)=>{
              if(ress.code == 200){
                wx.showModal({
                  title: '提示',
                  content: '出售成功',
                  showCancel: false
                })
              }
            })
          }
        })
      }else if(click_idx == 5){
        // 验证
        this.signInOut()
      }
    }else if(this.data.room_identity == 3){
      // 代理人
      if(click_idx == 0){
        // 个人信息修改
      //   wx.navigateTo({
      //     url: '/pages/huiyibang/addCheck/index'
      //   })
      // }else if(click_idx == 1){
        // 促销券管理
        wx.navigateTo({
          url: '/pages/promotion/index'
        })
      }
    }else if(this.data.room_identity == 4){
      // 销售员
      if(click_idx == 0){
        // 销售
        wx.scanCode({
          success(res) {
            console.log('扫码返回的参数: '+JSON.stringify(res));
            // console.log('截取字符串后：'+res.result.replace("https://h.3p3.top?data=",""))
            let data = res.result.replace("https://h.3p3.top?data=","");
            let dataStr = JSON.parse(data.split('&')[0]).couponSellIdKey;
            console.log('---促销券idkey---'+dataStr)
            sellaccept({
              accept: 1,
              idKey: dataStr //this.data.couponId
            }).then((ress)=>{
              if(ress.code == 200){
                wx.showModal({
                  title: '提示',
                  content: '出售成功',
                  showCancel: false
                })
              }
            })
          }
        })
      }else if(click_idx == 1){
        // 验证
        this.signInOut()
      }
      // else if(click_idx == 2){
      //   // 扫码绑定会议桌
      //   var that = this;
      //   wx.scanCode({
          
      //     success(res) {
      //       console.log('扫码返回的参数: '+res.result);
      //       console.log('截取字符串后：'+res.result.replace("https://q.3p3.top?data=",""))
      //       let dataStr = res.result.replace("https://q.3p3.top?data=","");
      //       that.setData({
      //         table_show: true,
      //         table_dataStr: dataStr 
      //       })
      //       console.log(dataStr)
      //     }
      //   })
      else if(click_idx == 2){
        // 房间权限申请
        wx.navigateTo({
          url: '/pages/huiyibang/roleList/index'
        })
      }
    }else if(this.data.room_identity == 5){
      // 嘉宾邀请
      if(click_idx == 0){
        // 房间权限管理
        wx.navigateTo({
          url: '/pages/huiyibang/roleList/index'
        })
      }else if(click_idx == 1){
        // 嘉宾角色管理
        wx.navigateTo({
          url: '/pages/huiyibang/addCheck/index'
        })
      }
    }else if(this.data.room_identity == 6){
      // 会议观察员
      if(click_idx == 0){
        // 节目进程查看
        wx.navigateTo({
          url: '/pages/huiyibang/menu/index?from=look&room_id='+this.data.room_id
        })
      }else if(click_idx == 1){
        // 查看农场
        wx.navigateTo({
          url: '/pages/huiyibang/roleList/index?type=1',
        })
      }else if(click_idx == 2){
        // 农场宏观视角
        wx.navigateTo({
          url: '/pages/huiyibang/Browse/index'
        })
      }else if(click_idx == 3){
        // 房间权限申请
        wx.navigateTo({
          url: '/pages/huiyibang/roleList/index'
        })
      }else if(click_idx == 4){
        // 嘉宾角色管理
        wx.navigateTo({
          url: '/pages/huiyibang/addCheck/index'
        })
      }
    }else if(this.data.room_identity == 7){
      // 物流站点
      if(this.data.log_identity == 0 || this.data.log_identity == null || this.data.log_identity == ''){
        // 物流封装站点
        if(click_idx == 0){
          this.getProjectList();
        }else if(click_idx == 1){
          // 视频权益列表
          wx.navigateTo({
            url: '/pages/qinqinhehe/videoInterests/index?type=2'
          })
        }else if(click_idx == 2){
          // 权益接收
          this.showBossCode();
          this.setData({
            show: true
          })
        }
      }else if(this.data.log_identity == 1){
        // 物流装车站点
        let that = this;
        if(click_idx == 0){
          wx.scanCode({
            success(res) {
              console.log('扫车子二维码返回的参数---'+res.result);
              let data = res.result.replace("https://h.3p3.top?data=","");
              let codeNumber = data.split(',')[2].split('=')[1];
              console.log('codeNumber---'+codeNumber);
              that.setData({
                big_code: codeNumber
              })
              wx.showModal({
                title: '提示',
                content: '扫描成功',
                showCancel: false
              })
            }
          })
        }else if(click_idx == 1){
          if(that.data.big_code == ''){
            publicFun.getToast('请先扫描车的二维码');
            return;
          }
          wx.scanCode({
            success(res) {
              console.log('扫箱子二维码返回的参数---'+res.result);
              let data = res.result.replace("https://h.3p3.top?data=","");
              let codeNumber = data.split(',')[2].split('=')[1];
              console.log('codeNumber---'+codeNumber);
              createRelationByTypeId({
                codeNumberParent: that.data.big_code,
                codeNumberSon: codeNumber,
                userId: wx.getStorageSync('userInfo').unionId
              }).then((ress)=>{
                if(ress.code == 200){
                  wx.showModal({
                    title: '提示',
                    content: '装车成功',
                    showCancel: false
                  })
                  that.scanSell(codeNumber,res.result);
                }
              })
            }
          })
        }
      }else if(this.data.log_identity == 2){
        // 物流中转站点
        var that = this;
        if(click_idx == 0){
          // 创建站点
          getCouponsell({
  
          }).then((ares)=>{
            if(ares.code == 200){
              wx.scanCode({
                success(res) {
                  let data = res.result.replace("https://h.3p3.top?data=","");
                  let codeNumber = data.split(',')[2].split('=')[1];
                  console.log(codeNumber+'---code - remark---'+wx.getStorageSync('remark'))
                  that.scanSell(codeNumber,res.result);
                }
              })
            }
          })
        }
      }else if(this.data.log_identity == 3){
        // 物流散货站点
        if(click_idx == 0){
          this.setData({
            videoLinks: [{name: '视频1',videoLink: ''}],
            show2: true
          })
        }
      }
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
          show3: false
        })
        wx.showModal({
          title: '提示',
          content: '绑定成功',
          showCancel: false
        })
      }
    })
  },
  scanSell(codeNumber,result){
    createCodeLogisticsRecord({
      codeNumber: codeNumber, //this.data.couponId
      remark: wx.getStorageSync('remark'),
      userId: wx.getStorageSync('userInfo').unionId
    }).then((ress)=>{
      if(ress.code == 200){
        if(this.data.log_identity == 2){
          let data = wx.getQueryString({
            url: result,
            name: "data"
          });
          wx.setStorage({
            data: encodeURIComponent(result),
            key: 'params',
          })
          wx.navigateTo({
            url: '/pages/demo/index?data=' + data
          })
        }
      }
    })
  },
  signInOut(){
    var that = this;
    wx.scanCode({
      success(res) {
        console.log('扫码返回的参数: '+JSON.stringify(res));
        // console.log('截取字符串后：'+res.result.replace("https://h.3p3.top?data=",""))
        let data = res.result.replace("https://h.3p3.top?data=","");
        let dataStr = data.split('&')[0];
        let userId = data.split('&')[1].replace("userId=","");
        // let dataStr = JSON.parse(data).url.replace("https://h.3p3.top?data=","");
        // let idKey = JSON.parse(data).idKey;
        // let userId = JSON.parse(data).userId;
        console.log('截取字符串后：'+dataStr)
        // console.log('idKey----'+idKey)
        // let userId = res.result.split(',')[0].substring(11);
        // userId = userId.substring(0,userId.length-1);
        console.log('userId----'+userId)
        // 验证促销券
        verifySellCoupon({
          couponType: 0,
          // idKey: idKey,
          // roomId: wx.getStorageSync('room_id'),
          // userId: userId,
          data: dataStr//要购买的促销劵二维码
        }).then(resg=>{
          console.log('出售成功：'+JSON.stringify(resg));
          if(resg.code == 200){
            wx.showModal({
              title: '提示',
              content: '验证成功',
              showCancel: false
            })
          }
        })
      }
    })
  },
  vefityCoupon(){
    var that = this;
    wx.scanCode({
      success(res) {
        console.log('扫码返回的参数: '+JSON.stringify(res));
        // console.log('截取字符串后：'+res.result.replace("https://h.3p3.top?data=",""))
        let data = res.result.replace("https://h.3p3.top?data=","");
        let dataStr = data.split('&')[0];
        verifySellCoupon({
          couponType: 1,
          data: dataStr
        }).then(resg=>{
          console.log('出售成功：'+JSON.stringify(resg));
          if(resg.code == 200){
            console.log(JSON.stringify(resg));
            publicFun.getToast("验证成功");
          }
        })
      }
    })
  },
  bindPickerChange(e){
    wx.setStorageSync('index'+wx.getStorageSync('room_id'), e.detail.value);
    wx.setStorageSync('room_role'+wx.getStorageSync('room_id'), this.data.role_list[e.detail.value]);
    console.log('---治疗身份---'+wx.getStorageSync('room_role'+wx.getStorageSync('room_id')))
    this.setData({
      index: e.detail.value,
      room_identity: this.data.role_list[e.detail.value]
    })
    this.getRoleInit();
  },
  deleteMeeting(){
    let that = this;
    wx.showModal({
      title: "提示",
      content: "确定要退出当前治疗吗？",
      success: function(mos){
        if(mos.confirm){
          emptyRoomRole({
            roomId: wx.getStorageSync('room_id'),
            userId: wx.getStorageSync('userInfo').unionId
          }).then((res)=>{
            console.log('----删除治疗----'+JSON.stringify(res))
            if(res.code == 200){
              wx.removeStorageSync('room_id');
              that.onShow();
            }
          })
        }
      }
    })
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