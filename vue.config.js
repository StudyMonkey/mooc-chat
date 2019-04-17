module.exports = {

    // 默认在生成的静态资源文件名中包含hash以控制缓存
    filenameHashing: false,

    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
    productionSourceMap: false,
    
    devServer: {
        open: true,
        host: '0.0.0.0',
        disableHostCheck: true,
        proxy: {
            '/v2': {
                target: 'ws://172.26.75.222',
                ws: true,
                changeOrigin: true, // 允许跨域
                pathRewrite: {
                    '^/v2': ''
                }
            }
        }
    }

}