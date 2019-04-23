<template>
    <div class="createGroupTopWrap">
        <x-prompt>
            <p>交流小组并非单位组织的单位
                学习小组。如您是单位管理员并未
                创建单位学习小组请点击下方按钮
                前往系统后台直接创建单位学习小
                组。
            </p>
            <a-button size="small">前往创建</a-button>
        </x-prompt>
    </div>
</template>

<script>
import XPrompt from '@/components/prompt'
export default {
    name: 'prompt',
    components: {
        XPrompt,
    }

}
</script>

<style lang='less' scoped>
.createGroupTopWrap{

}
</style>
