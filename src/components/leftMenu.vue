<template>
    <div class="leftMenu">
        <a-avatar 
            shape="square" 
            size="default"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
        <ul>
          <li 
            class="menuIconWrap" 
            v-for="(item,index) in menuList" 
            :key="index"
          >
            <router-link 
              :to='item.link' 
            >
              <span :class="[item.type, 'iconfont']" :title="item.title"></span>
            </router-link>
          </li>
          <li class="menuIconWrap">
            <router-link 
              to='/message' 
            >
              <a-badge :count="1" dot>
                <span :class="['iconxinfeng', 'iconfont']" title="消息"></span>
              </a-badge>            
            </router-link>            
          </li>
          <li class="menuIconWrap">
            <router-link 
              to='/setting' 
            >
              <span :class="['iconshezhi', 'iconfont']" title="设置"></span>
            </router-link>            
          </li>          
        </ul>
    </div>
</template>

<script>
export default {
  name: 'leftMenu',
  data() {
      return {
          menuList: [
            { type: 'iconsiliao', title: '聊天', link: '/chat' },
            { type: 'iconqunliao', title: '我加入的小组', link: '/about'},
            { type: 'icontongxunlu', title: '通讯录', link: '/member'},
            { type: 'iconsousuo', title: '查找用户和小组', link: '/search'},
            { type: 'iconincrease', title: '创建小组', link: '/add'},
          ]
      }
  },
}
</script>

<style lang='less' scoped>
a{ text-decoration: none }
.leftMenu{
  width: 60px;
  height: 700px;
  background-color: #024d45;
  .ant-avatar{
    width: 30px;
    height: 30px;
    margin: 15px 16px 20px;
    border: 1px solid #bbbbbb;
    border-radius: 0;
  }
  .menuIconWrap{
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 18px;
    font-size: 20px;
    margin: 0 auto 20px;
    &:nth-child(3){
      margin-bottom: 40px;
    }    
    &:nth-child(5){
      margin-bottom: 355px;
    }
    a{
      color: #66918c;
      &:hover{
        color: #69ccc1
      }
      &.router-link-active{
        color: #f39800
      }
      span.iconfont{
        font-size: 20px;
      }
    }
  }
}
</style>
