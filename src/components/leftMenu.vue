<template>
    <div class="leftMenu">
        <a-avatar 
            shape="square" 
            size="default"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        />
        <ul>
          <li class="menuIconWrap" v-for="(item,index) in menuList" :key="index">
              <a-icon :type="item.type"></a-icon>
          </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            menuList: [
                { type: 'github', title: '测试' },
                { type: 'wechat', title: '测试1'}
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
  }
}
</style>
