<template>
    <div class="setMiddleWrap middleWrap">
        <div class="promptWrap">
            <span class="iconfont icontishi"></span>
            温馨提示
        </div>
        <div class="promptContent">
            <slot></slot>                                       
        </div>
    </div>    
</template>

<script>
export default {

}
</script>

<style lang='less' scoped>
.setMiddleWrap{
    .promptWrap{
        display: flex;
        height: 36px;
        align-items: center;
        background-color: #e7e7e7;
        color: #666666;
        span{
            color: #ff5400;
            margin: 0 3px 0 11px;
        }
    }
    .promptContent{
        height: 664px;
        color: #444444;
        padding: 21px 17px 0 18px;
        p{
            text-indent: 23px;
        }
        span{
            color: #fd672b;
        }
    }
} 
</style>
