<template>
    <div class="chatMainBox">
        <a-modal
            class="checkMemberModal"
            v-model="cardVisible"
            centered
            :closable="false"
            :footer="null">
            <check-member 
                useType="2" 
                :clearCheckArr="clearCheckArrNum" 
                @checkMemberSureBtn="handleCheckMemberSureBtn" 
                @quickCreateGroup="handleQuickCreateGroup"
            >
                <span>勾选好友，发送名片</span>
            </check-member>
        </a-modal>
        <a-modal 
            title="添加图片链接"
            v-model="imgVisible"
            centered
            @cancel="handleImageLinkCancel"
            :footer="null">
            <div class="groupLogoWrap">
                <span>添加图片：</span>
                <a-upload
                    name="picture"
                    accept=".gif,.png,.jpg,.bmp"
                    listType="picture-card"
                    :fileList="fileList"
                    :customRequest="handleCustomRequest"
                    :remove="handleImageRemove"
                    @preview="handlePreview"
                    @change="handleChange"
                >
                    <div v-if="fileList.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">上传图片</div>
                    </div> 
                </a-upload> 
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                    <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>  
            </div>           
            <div class="linkAddressWrap">
                <span>链接地址：</span>
                <a-input  placeholder="请输入图片链接地址..." v-model="imgLinkAddress" />
            </div>
            <div class="footerPrompt">
                <p><span class="iconfont icontishi"></span>可发送带有超链接的点击跳转的图片</p>
                <a-button class="greenBtn" @click="handleImgLinkSureBtn" :disabled="fileList.length === 0">确定</a-button>
            </div>
        </a-modal>
        <a-modal 
            title="添加文本链接"
            v-model="linkVisible"
            centered
            :footer="null"
        >
            <div class="linkAddressWrap linkAddressWrap_sec linkAddressWrap_sec1">
                <span>标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题<i>*</i>：</span>
                <a-input placeholder="请输入文本链接标题..." v-model="textLinkTitle" />
            </div>
            <div class="linkAddressWrap linkAddressWrap_sec">
                <span>链接地址<i>*</i>：</span>
                <a-input placeholder="请输入文本链接地址..." v-model="textLinkAddress" />
            </div>
            <div class="footerPrompt">
                <p><span class="iconfont icontishi"></span>可发送带有超链接的点击跳转的文字</p>
                <a-button 
                    class="greenBtn" 
                    @click="handleTextLinkSureBtn" 
                    :disabled="textLinkTitle === ''"
                >确定</a-button>
            </div>
        </a-modal> 
        <a-modal 
            title="添加好友"
            v-model="addCardFriendModal"
            centered
            :footer="null"
        >
            <div class="addFriendWrap">
                <a-textarea v-model="addFriendReason" :rows="4" placeholder="请输入添加理由" />
                <a-button 
                    style="margin: 10px 0 0 421px;" 
                    class="greenBtn" size="small" 
                    @click="handleAddFriendSure"
                >确定</a-button>
            </div> 
        </a-modal>       
        <div id="chatScrollArea" class="chatScrollArea lm_scroll">
            <ul>
                <li 
                    v-for="(item,index) in chatList" 
                    :key="index"
                    :class="[ item.fromEid === $myEid ? 'fr' : 'fl' ]"
                >
                    <a-popover
                        placement="rightBottom"
                        :class="[ item.fromEid === $myEid ? 'fr' : 'fl' ]"
                    >
                        <template slot="content" v-if="item.fromEid !== 'notice'">
                            <div class="personInfoWrap">
                                <x-avatar :imgUrl="item.fromPic" />
                                <div>
                                    <div class="memoNameWrap" v-if="item.isFriend">
                                        <div v-if="memoNameShow">
                                            <i>{{ item.backupText ? item.backupText : '昵称' }}</i>
                                            <span @click="handlePenClick" class="iconfont iconpen"></span>
                                        </div>
                                        <div class="memoNameBtnWrap" v-else>
                                            <a-input v-model="memoName" placeholder="请输入备注名" class="memoName" />
                                            <a-button size="small" @click="saveMemoName(item, 'title')">保存</a-button>
                                        </div>        
                                    </div>                                     
                                    <!-- <memo-name from='1' @saveMemoName="handleSaveMemoName" /> -->
                                    <p>用户名：<span v-text="item.fromName"></span></p>
                                </div>
                            </div>
                            <div class="partInfoWrap">
                                <p>单位：<span v-text="item.fromEidDept"></span></p>
                                <p class="partIconWrap">
                                    <span 
                                        v-if="item.fromEid !== $myEid"
                                        title="点击发送私聊消息" 
                                        @click="handleChatSend(item)" 
                                        class="iconfont iconsiliao" 
                                    />
                                    <span 
                                        v-if="item.fromEid !== $myEid"
                                        :title="[ item.isFriend ? '点击删除好友' : '点击添加好友' ]"
                                        :class="[item.isFriend ? 'iconshanhaoyou' : 'iconjiahaoyou', 'iconfont']" 
                                        @click="showAddFriend(item, 'title')" 
                                    />                                  
                                </p>
                            </div>
                            <div class="addFriendWrap" v-if="showAddFriendWrap">
                                <p>添加好友<span class="iconfont icondelete" @click="hideAddFriend"></span></p>
                                <a-textarea 
                                    v-model="addFriendReason" 
                                    :rows="4" 
                                    placeholder="请输入添加理由" 
                                />
                                <a-button 
                                    class="greenBtn" 
                                    size="small" 
                                    @click="handleAddFriendSure"
                                >确定</a-button>
                            </div>
                        </template>
                        <div>
                            <x-avatar :class="[ item.fromEid === $myEid ? 'fr' : 'fl' ]" :imgUrl="item.fromPic" />
                        </div>
                    </a-popover>
                    <div :class="[ item.fromEid === $myEid ? 'fr mr10 ' : 'fl ml10 textAlignL','chatInfoWrap' ]">
                        <!-- <p><span v-text="item.name"></span></p> -->
                        <div :class="[ item.fromEid === $myEid ? '' : '', 'mesContent' ]">                          
                            <template v-if="item.chatType === 0">
                                <div v-html="item.text"></div>
                            </template>
                            <template v-else-if="item.chatType === 1 || item.chatType === 2">
                                <div v-html="emoji(item.text)"></div>
                            </template>
                            <template v-else-if="item.chatType === 11">
                                <div class="sendChatWrap">
                                    <div class="personInfoWrap">
                                        <x-avatar :imgUrl="item.text.imgUrl" />
                                        <div>
                                            <!-- <div class="memoNameWrap" v-if="item.text.isFriend">
                                                <div v-if="memoNameShow">
                                                    <i>{{ item.text.remark ? item.text.remark : '昵称' }}</i>
                                                    <span 
                                                        @click="handlePenClick" 
                                                        class="iconfont iconpen"
                                                        style="color: #f0b577"
                                                    ></span>
                                                </div>
                                                <div class="memoNameBtnWrap" v-else>
                                                    <a-input v-model="memoName" placeholder="请输入备注名" class="memoName" />
                                                    <a-button size="small" @click="saveMemoName(item, 'card')">保存</a-button>
                                                </div>        
                                            </div>                                             -->
                                            <p>用户名：<span>{{item.text.userName}}</span></p>
                                        </div>
                                    </div>
                                    <div class="bottomInfoWrap" @click.capture="handleSearchFriend(item)">
                                        <a-tooltip>
                                            <template slot="title">
                                                点击可查看单位和好友关系
                                            </template>
                                            <div 
                                                v-show="!item.text.showCard" 
                                                style="cursor: pointer" 
                                                title=""
                                            > 
                                                个人名片
                                            </div>
                                        </a-tooltip>                                       
                                        <div class="partInfoWrap" v-show="item.text.showCard">
                                            <p class="partWordWrap">单位：<span>{{item.text.unit}}</span></p>
                                            <p class="partIconWrap">
                                                <!-- <span v-show="item.text.fromEid === $myEid" title="点击发送私聊消息" @click="handleChatSend(item)" class="iconfont iconsiliao" /> -->
                                                <span 
                                                    :title="[ item.text.isFriend ? '点击删除好友' : '点击添加好友' ]"
                                                    :class="[item.text.isFriend ? 'iconshanhaoyou' : 'iconjiahaoyou', 'iconfont']" 
                                                    @click.stop.prevent="showAddFriend(item, 'card')" 
                                                />                                  
                                            </p>
                                        </div> 
                                    </div>                        
                                </div>
                            </template>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <ul class="iconListWrap">
            <a-dropdown placement="topLeft" v-show="$store.state.chosedLi.groupType !== 2">
                <a-tooltip placement="top">
                    <template slot="title">
                        艾特
                    </template>
                    <span class="iconaite iconfont"></span>
                </a-tooltip>
                <a-menu slot="overlay" @click="onClick">
                    <a-menu-item key="all" title="此选项可艾特群内所有人">所有人</a-menu-item>
                    <a-menu-item 
                        v-for="item in groupMemberList" 
                        :key="item.id"
                    >
                        <x-avatar :imgUrl="item.bakField"></x-avatar>
                        <span class="name" v-text="item.memberNick"></span> 
                    </a-menu-item>                                                          
                </a-menu>
            </a-dropdown>

            <li v-for="(item,index) in iconList" :key="index">
                <a-tooltip>
                    <template slot="title">
                        {{item.title}}
                    </template>
                    <span>
                        <span @click="handleIconClick(item)" :class="[item.type, 'iconfont']"></span>
                    </span>                
                </a-tooltip>            
            </li>
            <li>
                <a-tooltip>
                    <template slot="title">
                        新版上传文件功能开发中...
                    </template>
                    <span>
                        <span class="iconfont iconwenjian"></span>
                    </span>                
                </a-tooltip>                
            </li>
            <a-button 
                size="small"
                :disabled="!(chatList.length >= 20*(historyPage - 1))"
                class="fr"
                @click="handleLoadMoreChat"
            >
                {{ chatList.length >= 20*(historyPage - 1) ? '点击加载历史记录' : '无更多历史记录' }}
            </a-button>          
        </ul>
        <a-modal
            v-model="showEmoji"
            centered
            :footer="null"
        >        
            <div class="emojiPosition">
                <vue-emoji
                    @select="selectEmoji">
                </vue-emoji>
            </div>
        </a-modal>
        <a-textarea 
            v-model="chatCon" 
            placeholder="请输入......" 
            :rows="4" 
            @keyup.enter.native="handleSendBtnClick"
            @keydown="handleKeyDownDel($event)" 
        />
        <div class="sendWrap fr">
            <p>按Enter发送</p>
            <a-button class="greenBtn" @click="handleSendBtnClick" size="small">发送</a-button>
        </div>
        
    </div>
</template>

<script>
import XAvatar from '@/components/avatar'
import CheckMember from '@/components/checkMember'
import vueEmoji from '@/components/emoji'
import MemoName from '@/components/memoName'
import UploadImg from '@/components/uploadImg'
import { getCookie } from '../utils/utils'
export default {
    name: 'chat',
    data() {
        return {
            memoNameShow: true,  //  备注名和input框的输入切换显示
            memoName: '',       //  更改备注名的输入框            
            chosedMember: '',  // 点击添加好友选中的某人
            websocket: this.$store.state.ws,  // 初始websocket对象
            showEmoji: false,
            chatCon: '', // 用户输入的聊天内容 
            chatList: this.$store.state.chatConList,
            chosedLi: this.$store.state.chosedLi, // 从vuex里面获取到的所点击的左侧某个列表
            checkMemberList: [], // 接收checkMember组件传递过来的好友列表
            showAddFriendWrap: false, // 聊天信息头像框的信息显示隐藏
            showCardAddFriend: '', // 名片添加好友显示
            addCardFriendModal: false,  // 名片添加还有的modal框显示隐藏控制
            addFriendReason: '', // 添加好友理由
            cardVisible: false, // 发送名片框的显示隐藏控制
            imgVisible: false, // 发送图片框的显示隐藏控制
            linkVisible: false, // 发送链接框的显示隐藏控制
            imgLinkAddress: '', // 图片的链接地址
            textLinkAddress: '', // 文本的链接地址
            textLinkTitle: '',  // 文本链接标题
            historyPage: 2,  // 加载历史记录的分页数
            // wsReadyState: this.ws.readyState,  // websocket连接状态， 0 未建立连接， 1 已建立连接，可通信。 2 连接正在关闭，3 连接已关闭
            iconList: [
                // { type: 'iconaite', title: '艾特' },
                { type: 'iconbiaoqing', title: '表情'},
                { type: 'icontupian', title: '发送图片'},
                { type: 'iconlianjie', title: '发送链接'},
                // { type: 'iconwenjian', title: '发送文件'},
                { type: 'iconmingpian', title: '发送名片'},
            ], 
            user: this.$store.state.user,  // 用户信息 
            base64Url: '', // 图片转换成的base 64url信息 
            saveChatListLen: 0,  //  聊天记录条数
            previewVisible: false,
            previewImage: '',
            fileList: [],  //  聊天上传图片的数组
            groupMemberList: [],  //  获取到小组里面的所有成员列表 
            aiteEids: '',  // 所选择艾特的人的eid
            aiteNick: [],  // 所选择艾特的人的用户名
            eventType: 1,  //  事件类型，默认是1，按键盘上的删除改为2 
            clearCheckArrNum: 1,  //  chat 组件告知 checkMember 组件清空所选择的个人名片，默认为1，2为名片发送完成可以清空
            isHistoryHeight: false    //  发送消息和取历史记录的滚动由这个值来判断
        }
    },
    computed: {
        getChatConList() {
            return this.$store.state.chatConList
        },
        getChosedLi(){
            return this.$store.state.chosedLi
        }
    },
    watch: {
        getChatConList(curval, oldval){         
            if ( curval !== oldval ) {
                this.chatList = curval;
            }
        },
        chatList(){
            this.$nextTick(() => { // 不加nextTick只到倒数第二条
                var container = this.$el.querySelector('#chatScrollArea')
                container.scrollTop = this.isHistoryHeight ? container.scrollHeight/2 : container.scrollHeight;
                this.isHistoryHeight = false     
            })           
        },
        getChosedLi: {
            handler(n, o) {
                if ( n !== o ) {
                    this.chosedLi = this.$store.state.chosedLi;
                    this.getGroupAllPeople();
                    // 切换选择li列表时，需要将这个值变为初始值
                    this.historyPage = 2;
                }
            },
            deep: true
        },
        chatCon: {
            handler(n, o) {
                if ( n !== o && this.eventType === 2 ) {
                    let newArr = [];
                    let newEidArr = '';
                    let nickArr = n.split('@');   //  nickArr = ['1111'] 
                    if ( nickArr.length > 1 ) {
                        nickArr.map ( v => {                   
                            if ( this.aiteNick.indexOf(v) > -1 ) {
                                newArr.push(v);                                                   
                            }
                        })
                        newArr.map ( v => {
                            this.groupMemberList.map ( j => {
                                if ( j.memberNick === v ) {
                                    newEidArr = newEidArr.concat(j.memberEid+ ',');
                                }                        
                            })
                            if ( v === '所有人' ) {
                                newEidArr = newEidArr.concat('all,');
                                return false
                            }                        
                        })
                        this.aiteNick = newArr;
                        this.aiteEids = newEidArr;
                    }                              
                    this.eventType = 1;
                }
            }
        },
        aiteNick: {
            handler(n, o) {
                this.chatCon = '';
                this.aiteNick.map ( v => {
                    this.chatCon += `@${v}`;
                })
            },
            deep: true            
        }
    },
    components: {
        XAvatar,
        CheckMember,
        vueEmoji,
        MemoName,
        UploadImg
    },
    methods: {
        // 添加图片链接的 cancel 事件
        handleImageLinkCancel(){
            this.fileList = [];
        },
        // 上传图片的删除事件处理
        handleImageRemove(){
            this.fileList = []
        },
        // 键盘上的删除事件响应
        handleKeyDownDel(e){
            if ( e.keyCode === 8 ) {
                this.eventType = 2
            }           
        },
        // 通过 groupId 获取小组里面的所有人
        async getGroupAllPeople(){
            const res = await this.$getData('/member/getMembersByGroupId.action', {
                groupId: this.chosedLi.groupId,
                myEid: this.$myEid
            });
            this.groupMemberList = res.data.rows;
        },
        // 艾特的点击事件
        onClick({ key }){
            if ( key !== 'all' ) {
                let index = this.groupMemberList.findIndex( v => v.id === key );
                let eid = this.groupMemberList[index].memberEid;
                let nick = this.groupMemberList[index].memberNick;
                if ( this.aiteEids !== '' ) {
                    this.aiteEids = this.aiteEids.concat(','+eid);
                } else {
                    this.aiteEids = this.aiteEids.concat(eid);
                } 
                this.aiteNick.push(nick);                                       
            } else {
                if ( this.aiteEids !== '' ) {
                    this.aiteEids = this.aiteEids.concat(',all');
                } else {
                    this.aiteEids = this.aiteEids.concat('all');
                }                 
                this.aiteNick.push('所有人');
            }           
        },
        //  上传图片事件处理
        handleCancel () {
            this.previewVisible = false
        },
        handlePreview (file) {
            this.previewImage = file.url || file.thumbUrl
            this.previewVisible = true
        },
        handleChange ({ fileList }) {
            this.fileList = fileList;    
        }, 
        handleCustomRequest(options){
            let _this = this;
            let file = options.file;
            var reader = new FileReader();
            const isLt2M = file.size / 1024 / 1024 < 2;
            if ( !isLt2M ) {
                this.$message.error('上传产品图片大小不能超过 2MB！');
            }
            // 创建一个img对象
            var img = new Image();
            let filename = options.filename;
            if ( file ) {
                reader.readAsDataURL(file);
            }
            if ( isLt2M ) {
                reader.onload = ( e ) => {
                    let base64Str = reader.result.split(',')[1];
                    this.base64Url = e.target.result;
                    this.fileList = [
                        {
                            ...this.fileList[0], 
                            status: 'done', 
                            thumbUrl: e.target.result,
                            uid: -1
                        }
                    ]
                }
            }         
            return true;
        },
        //  上传图片事件结束       
        /**
         * 点击修改备注名事件
         */
        handlePenClick(){
            this.memoNameShow = false;
        }, 
        /**
         *  修改备注名的保存按钮点击事件
         */
        async saveMemoName(item, type){
            let friendEid = type === 'title' ? item.friendEid : item.text.friendEid        
            // this.person.remark = this.memoName
            const res = await this.$postData('/modifyRemark.do', { 
                userEid: this.$myEid,
                friendEid,
                remark: this.memoName
            })
            if ( res.data.success ) {
                this.memoNameShow = true;
            }
        },               
        selectEmoji (code) {
            this.showEmoji = false
            this.chatCon += code;
        },
        /**
         *  处理点击加载历史记录 
         */
        async handleLoadMoreChat() {
            const res = await this.$getData('/chat/history.action', {
                groupId: this.chosedLi.groupId,
                pageNo: this.historyPage
            });
            const { data: { rows } } = res;
            // this.saveChatListLen = rows.length
            if ( rows.length > 0 ) {
                this.chatList = rows.concat(this.chatList);
                this.$store.commit('addChatConList', this.chatList);
                this.historyPage++;
                this.isHistoryHeight = true
            }
        },
        /**
         * memoName组件传递过来的参数
         * 修改昵称的点击事件
         */
        handleSaveMemoName(name){
            console.log(name)
        },
        async sendPicture(){
            const res = await this.$postData('/upload/sendPicture.action', {
                eid: this.$myEid,
                linkImgAddress: this.imgLinkAddress, 
                groupId: this.chosedLi.groupId, 
                pictureCode: this.base64Url
            });
        },
        // 名片的点击事件
        async handleSearchFriend(item){
            if ( item.text.isFriend !== undefined ) {
                item.text.showCard = !item.text.showCard;
                const index = this.chatList.findIndex( v => v.date === item.date );
                this.chatList.splice(index, 1, item);
            } else {
                const res = await this.$getData('/member/recommendFriends.action', {
                    myEid: this.$myEid,
                    friendEid: item.text.friendEid
                });
                const { data: { success, obj } } = res;
                if ( success ) {
                    item.text.isFriend = obj;
                    item.text.showCard = !item.text.showCard;
                    const index = this.chatList.findIndex( v => v.date === item.date );
                    this.chatList.splice(index, 1, item);
                } else {
                    this.$message.error('查询好友关系失败')
                } 
            }
                    
        },
        // 点击发送消息逻辑
        async handleSendBtnClick(item){ 
            let newObj = {};
            let newObj_copy = {}; 
            //newObj.chatType 聊天形式，1 为 普通文本， 0 为 图片类型， 2 为 文本带链接， 11 为 名片类型
            /**
             * 发送名片的逻辑代码
             */
            if ( this.checkMemberList.length > 0 ) {
                newObj.chatType = 11;
                this.chatCon = {...item};
            }
            /**
             * 聊天发送图片的逻辑
             * chatType 需设置为0
             * text 为空，内容由后台拼成，如果有链接地址还需要带上 a 标签
             * 前台也需要拼一个显示在前台的
             */
            if ( this.base64Url !== '' && this.imgLinkAddress ) {
                newObj.chatType = 0;            
                this.chatCon = `<a class="imgLinkWrap" href="${this.imgLinkAddress}" target="_blank"><img src="${this.base64Url}" /><span class="iconfont iconlianjie"></span></a>`;      
                this.sendPicture();
            }else if ( this.base64Url !== '' ) {
                newObj.chatType = 0;              
                this.chatCon = `<img src="${this.base64Url}" />` 
                this.sendPicture();       
            }
            /**
             * 发送文本链接的事件处理
             */
            if ( this.textLinkAddress && this.textLinkTitle ) {
                newObj.chatType = 1;
                this.chatCon = `<a href="${this.textLinkAddress}" target="_blank">${this.textLinkTitle}</a>`
            }                      
            if ( typeof this.chatCon === "object" || this.chatCon.trim() !== '' ) {
                // this.chatType = 0;
                newObj.fromEid = this.user.eid,
                newObj.fromEidDept = this.user.displayunitname;
                newObj.fromPic = this.user.userimg;
                newObj.fromName = this.user.username,
                newObj.time = new Date();
                newObj.groupId = this.chosedLi.groupId;
                newObj.groupName = this.chosedLi.name;
                newObj.groupUrl = this.chosedLi.avatar; 
                if ( typeof newObj.chatType !== 'number' ) {                   
                    if ( this.chosedLi.groupType === 2 ) {
                        newObj.chatType = 2; // 私聊chatType 为2
                    } else {
                        newObj.chatType = 1; // 其他类型的chatType 都为 1
                    }
                }                   
                newObj.to = '';
                newObj.atEids = this.aiteEids;                               
                newObj.text = this.chatCon;
                newObj_copy = JSON.parse(JSON.stringify(newObj));
                this.chatList.push(newObj);              
                // websocket 发送消息
                
                // 发送图片把 newObj.text 改为空，内容由后台拼成，其他不变
                if ( this.base64Url !== '' ) {
                    newObj_copy.text = ''
                }
                if ( newObj_copy.chatType === 11 ) {
                    newObj_copy.text = JSON.stringify(newObj_copy.text);
                }
                this.websocket.send(JSON.stringify(newObj_copy)); 
                // 清空那些 input 输入框的值      
                this.imgLinkAddress = '';
                this.base64Url = ''; 
                this.fileList = [];              
                this.chatCon = '';
                this.aiteEids = '';   // 艾特所存储的eid
                this.aiteNick = [];   // 艾特所存储的用户名
                this.checkMemberList = [];  // 清空存储的名片勾选的数组列表
                this.clearCheckArrNum = 2;
            } else {
                this.$message.info('消息内容不能为空');
            }
        },
        // 发起私聊请求
        async handleChatSend(item){
            const res = await this.$getData('/member/privateMessage.action', {
                memberEid: item.fromEid,
                memberNick: item.fromName,
                eid: this.$myEid,
                ename: this.$myName
            });
            const { data: { obj } } = res;
            // 传递给chatPage一个事件，然后chatPage告诉chatList应该要请求一次列表，
            // 且在对应的groupId上有激活状态
            this.$store.commit('changeGroupId', obj.groupId);                      
        },
        /**
         * 删除好友的事件处理
         * 根据传递过来的 type 类型，判断是头像上的删除好友还是名片里的删除好友
         * title 是头像的删除，card是名片的删除
         */
        async handleDeleteFriend(type){ 
            let friendEid = '';
            if ( type === 'title' ) {
                friendEid = this.chosedMember.fromEid
            } else {
                friendEid = this.chosedMember.text.friendEid
            }
            const res = await this.$getData('/member/deleteFriends.action', {
                myEid: this.$myEid,
                friendEid
            });
            if ( res.data.success === true ) {
                this.$message.success('删除好友成功')
            }
        },
        // 用了两次的确认框弹出方法
        commonComfirm(type){
            let _this = this;
            this.$confirm({
                title: '确认从好友列表中删除此人么？',
                okText: '确认',
                cancelText: '取消',
                onOk(){
                    _this.handleDeleteFriend(type);
                }
            })
        },
        // 显示添加好友框
        showAddFriend(obj, type){  
            this.chosedMember = obj;      
            if( type === 'title' ) {
                if ( obj.isFriend ) {
                    this.commonComfirm('title');
                } else {
                    this.showAddFriendWrap = true;       
                }                
            } else {
                if ( obj.text.isFriend ) {
                    this.commonComfirm('card');
                } else {
                    this.addCardFriendModal = true;
                    // this.showCardAddFriend = obj.content.id
                } 
            }           
        },
        // 隐藏添加好友框
        hideAddFriend(){
            this.showAddFriendWrap = false;
        },
        // 添加好友确定按钮
        async handleAddFriendSure(){
            const res = await this.$postData('/applyfriend.do', {
                applyContent: this.addFriendReason,
                userEid: this.$myEid,
                friendEid: this.chosedMember.fromEid  //  chosedMember没有
            }); 
            if ( res.data.success === true ) {
                this.hideAddFriend();
                this.addCardFriendModal = false;
                this.$message.success('添加好友请求发送成功');
                this.addFriendReason = '';
            }               
        },
        // 图标的点击事件处理
        handleIconClick(item){
            if ( item.type === 'iconmingpian' ) {
                this.cardVisible = true;
            }
            if ( item.type === 'iconbiaoqing' ) {
                this.showEmoji = !this.showEmoji;
            }
            if ( item.type === 'icontupian' ) {
                this.imgVisible = !this.imgVisible;
            }
            if ( item.type === 'iconlianjie' ) {
                this.linkVisible = !this.linkVisible;           
            }
        },
        // 接收searchMember传递的事件处理
        handleQuickCreateGroup(obj){
            this.cardVisible = !obj;
        },
        // 接收checkMember传递勾选好友
        handleCheckMemberSureBtn(arr){
            if ( arr.length > 0 ){
                this.$router.push({
                    path: '/main/chat'
                })
                this.checkMemberList = arr;
                arr.map( item => {
                    this.handleSendBtnClick(item);
                })
            }
            this.cardVisible = false;
            // this.chatType = '3';
        },
        // 添加图片链接的确定按钮的点击事件
        handleImgLinkSureBtn(){
            this.imgVisible = false;
            this.handleSendBtnClick();
        },
        // 添加文本链接的确定按钮的点击事件
        handleTextLinkSureBtn(){
            this.linkVisible = false;
            this.handleSendBtnClick();
            this.textLinkAddress = '' 
            this.textLinkTitle = '';            
        }     
    },
    created() {  
        this.getGroupAllPeople();
        if ( this.saveChatListLen === 0 ) {
            this.saveChatListLen = this.$store.state.chatConList.length;
        }
        this.$nextTick(() => { // 不加nextTick只到倒数第二条
            var container = this.$el.querySelector('#chatScrollArea')
            container.scrollTop = container.scrollHeight
        })           
    },
}
</script>

<style scoped>
div >>> .checkMemberModal,
div >>> .checkMemberModal .ant-modal-content{
     width: 297px;
}
div >>> .checkMemberModal .ant-modal-content .ant-modal-body .checkMemberTopWrap{
    height: 511px;
}
div >>> .checkMemberModal .ant-modal-content .ant-modal-body .checkMemberTopWrap .listUserUlWrap{
    height: 402px;
    border-left: 1px solid #dcdcdc;
}
</style>
<style lang="less" scoped>
.groupLogoWrap{
    display: flex;
    align-items: center;
} 
.mr10{ margin-right: 10px; }
.ml10{ margin-left: 10px; }
.textAlignR{ text-align: right }
textarea[class='ant-input']{ resize: none }
.linkAddressWrap,.footerPrompt{
    display: flex;
    align-items: center;
    input{
        width: 400px;
        height: 28px;
    }
}
.linkAddressWrap_sec{
    input{
        width: 390px;
    }
    span{
        i{
            color: red;
        }
    }
}
.linkAddressWrap{
    margin: 20px 0 45px 0;
}
.linkAddressWrap_sec1{
    margin: 0
}
.footerPrompt{
    p{
        color: #333333;
        font-size: 14px;
        line-height: 20px;
        span{
            color: #ff8447;
            margin-right: 6px;
        }        
    }
    button{
        margin-left: auto;
    }

}

.ant-popover{
    div.ant-popover-inner-content{
        padding: 0;
        width: 252px;
        .personInfoWrap{
            display: flex;
            background-color: #f5f5f5;
            font-size: 14px;
            color: #333333;
            margin-bottom: 13px;
            .ant-avatar{
                margin-right: 10px;
            }
            div{
                line-height: 20px;
            }
            .memoNameWrap{
                line-height: 18px;
                span.iconfont{
                    cursor: pointer;
                    color: #f0b577;
                    margin-left: 4px;
                }
                .memoNameBtnWrap{
                    display: flex;
                    input{
                        height: 26px;
                        margin-right: 5px;
                    }
                }
            }            
        }
        .partInfoWrap{
            font-size: 14px;
            color: #333333;
            .partIconWrap{
                text-align: right;
                span{
                    cursor: pointer;
                    margin-left: 9px;
                }
            }
        }
        .addFriendWrap{
            overflow: hidden;
            p{
                padding: 9px 0;
            }
            span{
                float: right;
                cursor: pointer;
            }
            button{
                margin-top: 10px;
                float: right;              
            }
        }
    }
}

.chatMainBox{
    width: 640px;
    margin-top: 15px;
    .chatScrollArea{
        width: 638px;
        height: 416px;
        border: 1px solid #e5e5e5;
        padding: 12px 10px 0 10px;
        background-color: #f5f5f5;
        overflow-y: auto;
        overflow-x: hidden;
        ul{
            li{
                width: 390px;
                margin-bottom: 20px;
                div{
                    &.chatInfoWrap{
                        p{
                            font-size: 12px;
                            margin-top: -7px;
                        }
                    }
                    &.mesContent{
                        max-width: 338px;
                        border: 1px solid #eaeaea;
                        border-radius: 5px;
                        padding: 9px 10px;
                        font-size: 14px;
                        color: #696865;
                        position: relative;
                        background-color: #ffffff;
                        &::before {
                            content: '';
                            position: absolute;
                            top: 12px;                          
                            border-bottom: 8px solid transparent;
                            border-top: 8px solid transparent; 
                        } 
                        /deep/a{
                            text-decoration: underline;
                            &.imgLinkWrap{
                                display: block;
                                position: relative;
                                span.iconlianjie{
                                    position: absolute;
                                    width: 50px;
                                    height: 50px;
                                    text-align: center;
                                    line-height: 50px;
                                    background-color: rgb(255,84,0);
                                    border-radius: 50%;
                                    color: #fff;
                                    right: 10px;
                                    top: 10px;                                    
                                }
                            }
                        } 
                        /deep/img{
                            width: 312px;
                            height: 188px;
                            &.emojiImg{
                                width: 16px;
                                height: 16px;
                            }
                            &.emojiRabbitImg{
                                width: 50px;
                                height: 50px;
                            }
                        } 
                        /deep/.sendChatWrap{
                            width: 310px;
                            // height: 150px;
                            background-color: #ffffff;
                            .personInfoWrap{
                                display: flex;
                                background-color: #f5f5f5;
                                font-size: 14px;
                                color: #333333;
                                padding: 9px;
                                .ant-avatar{
                                    margin-right: 10px;
                                    img{
                                        width: 40px;
                                        height: 40px;
                                    }
                                }
                                div{
                                    line-height: 20px;
                                    text-align: left;
                                    p{
                                        font-size: 14px;
                                        margin-top: 0;
                                    }
                                }
                            }
                            .partInfoWrap{
                                font-size: 14px;
                                color: #333333;
                                padding: 13px 11px 10px 8px; 
                                p.partWordWrap{
                                    text-align: left;
                                    margin-top: 0;
                                    font-size: 14px;
                                    height: 50px;
                                }
                                .partIconWrap{
                                    text-align: right;
                                    span{
                                        cursor: pointer;
                                        margin-left: 9px;
                                    }
                                }
                            }
                            .addFriendWrap{
                                overflow: hidden;
                                p{
                                    padding: 9px 0;
                                }
                                span{
                                    float: right;
                                    cursor: pointer;
                                }
                                button{
                                    margin-top: 10px;
                                    float: right;              
                                }
                            }        
                        }                                             
                    } 
                    &.ml10{
                        .mesContent{
                            &::before{
                                left: -5px;
                                border-right: 8px solid #ffffff;
                                
                            }                      
                        }
                    } 
                    &.mr10{
                        .mesContent{
                            &::before{
                                right: -5px;
                                border-left: 8px solid #ffffff;
                            }                      
                        }
                    }                                      
                } 

            }
        }        
    }
    .iconListWrap{
        display: flex;
        background-color: #ffffff;
        position: relative;
        .iconaite{
            line-height: 36px;
            margin: 0 12px;
        }
        li{
            height: 20px;
            line-height: 20px;
            font-size: 18px;
            margin: 8px 12px 8px 0;
            color: #666666;
            cursor: pointer;
            &:hover{
                color: #f0b577
            }
            span{
                font-size: 18px;
            }
        }
        button.fr{
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
        }       
    }
    .sendWrap{
        display: flex;
        margin-top: 10px;
        p{
            font-size: 13px;
            color: #999999;
            margin: 3px 6px 0 0;
        }
    }
}
</style>

