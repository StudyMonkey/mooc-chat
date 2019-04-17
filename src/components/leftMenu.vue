<template>
    <div class="leftMenu">
        <a-avatar 
            shape="square" 
            size="default"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
        <ul>
          <li class="menuIconWrap" v-for="(item,index) in menuList" :key="index">
            <router-link :to='item.link'>
              <a-icon :title="item.title" :type="item.type"></a-icon>
            </router-link>
          </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            menuList: [
                { type: 'message', title: '聊天', link: '/' },
                { type: 'team', title: '我加入的小组', link: '/about'},
                { type: 'idcard', title: '通讯录', link: '/member'},
                { type: 'search', title: '查找用户和小组', link: '/member'},
                { type: 'plus', title: '创建小组', link: '/member'},
                { type: 'mail', title: '消息', link: '/member'},
                { type: 'setting', title: '设置', link: '/member'},
            ]
        }
    },
}
</script>

<style lang='less' scoped>
.leftMenu{
  width: 60px;
  height: 700px;
  background-color: #024d45;
  .ant-avatar{
    width: 28px;
    height: 28px;
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
        color: #cf8d0a
      }
    }
  }
}
</style>
