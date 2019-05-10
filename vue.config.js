module.exports = {

    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

    // 默认在生成的静态资源文件名中包含hash以控制缓存
    filenameHashing: true,

    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
    productionSourceMap: false,
    
    devServer: {
        open: true,
        host: '0.0.0.0',
        disableHostCheck: true,
        proxy: {
            '/group': {
                target: 'http://172.26.75.218/moocGroupApi/group',
                ws: true,
                changeOrigin: true, // 允许跨域
                pathRewrite: {
                    '^/group': ''
                }
            }
        }
    }

}