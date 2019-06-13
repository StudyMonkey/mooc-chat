import axios from 'axios'
import { message } from 'ant-design-vue'

axios.interceptors.response.use(
    response => {
        // console.log(response);
        if (response.status === 200) {
            // console.log( response );
            // if ( !response.data.data ) {
            //     message.error( response.data.errorInfo )
            // } 
            // console.log('请求成功');
        }
        return response
    }, err => {
        if( err.response.status === 401 ) {
            message.error('请求错误'); 
        }
        if( err.response.status === 500 ) {
            message.error('后台出错');            
        }
    }
)

function clearHanlder(){
    // store.commit('setToken', '');
    // localStorage.removeItem('token')
/*     router.push({
        path: '/login',
        query: {redirect: router.currentRoute.path}
        // router.currentRoute.path 回跳到当前页面 
    })  */    
}