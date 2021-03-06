import axios from 'axios'
import store from '../store/store'

const uri = 'https://www.easy-mock.com/mock/5cb7d8990b31727f3d58120a/mooc-chat/'

export async function allGet(url, data){
    store.commit('changeShowLoad', true);
    const res = await getData(url, {...data});
    store.commit('changeShowLoad', false);
    return res;
}

export function getData(url, data){
    return new Promise( (resolve, reject) => {
        axios.get(uri+url, {
            params: {
                ...data
            }
        }).then( res => {
            return resolve(res)
        }).then( err => {
            return reject(err)
        })
    })
}

/**
 * 
 * @param {请求地址} url 
 * @param {传递参数} data 
 */
export function postData(url, data){
    return new Promise( (resolve, reject) => {
        axios.post(uri+url, data).then( res => {
            return resolve(res)
        }).then( err => {
            return reject(err)
        })
    })
}

/***
 * 节流方法
 * @param func 输入完成的回调函数
 * @param delay 延迟时间
 */
export function debounce(func, delay) {
    let timer
    return (...args) => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

/* 
 * 搜索匹配替换变色的方法
 * @param {*传递进来的数组} arr
 * @param {*数组循环之后对象的属性值} obj
*/
export function matchChangeColor(arr, searchVal, obj1, obj2 ) {
    console.log(arr);
    // 匹配关键字正则
    let replaceReg = new RegExp(searchVal, 'g');
    // 高亮替换v-html值
    let replaceString = '<span class="searchText">' + searchVal + '</span>';
    // 过滤
    arr = arr.filter( 
        v => v[obj1].indexOf(searchVal) > -1 || v[obj2].indexOf(searchVal) > -1                   
    ); 
    console.log(arr);
    // 替换
    for ( let i = 0 ; i < arr.length; i++ ) {
        arr[i][obj1] = arr[i][obj1].replace(replaceReg, replaceString);
        arr[i][obj2] = arr[i][obj2].replace(replaceReg, replaceString);
    }
    return arr;
}

/* 
 * 清除搜索匹配的样式
 * @params arr   传递进来的数组
 * @params obj1  匹配的属性1
 * @params obj2  匹配的属性2 
*/
export function clearMatchColor(arr, obj1, obj2){
    let replaceReg = new RegExp('<span class="searchText">(.*?)<\/span>', 'g');
    for ( let i = 0 ; i < arr.length; i++ ) {
        arr[i][obj1] = arr[i][obj1].replace(replaceReg, '$1');
        arr[i][obj2] = arr[i][obj2].replace(replaceReg, '$1');
    } 
    // return arr;    
}

/**
 * 公用的获取数据的方法
 * @param {*获取数据的url} url 
 * @param {*获取数据的参数对象} obj 
 */
export async function commonGetData(url, params){
    this.$store.commit('changeShowLoad', true);
    const res = await getData(url, params);
    const { data: { data } } = res;
    this.$store.commit('changeShowLoad', false);
    return data
}

/**
 * 公用的获取cookie的方法
 * @param {*传入的需要获取cookie的名称} c_name 
 */
export function getCookie(c_name){
    if (document.cookie.length>0){ 
        console.log(document.cookie);
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){ 
            c_start=c_start + c_name.length+1; 
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        } 
    }
    return "";
}

/**
 * 公用的设置cookie的方法
 * 传入的需要设置cookie的key和value
 */
export function setCookie(c_name,value,expiredays){
    var cookieStr = "";
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie = c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : "; expires="+exdate.toGMTString())+";path=/";
}

/**
 * 公用的删除cookie的方法
 * @param {需要删除的cookie名称} c_name 
 */
export function delCookie(c_name) { 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(c_name);
    if(cval!=null) 
        document.cookie= c_name + "=;expires="+exp.toGMTString(); 
} 

/**
 * 处理时间格式的函数
 */
export function timeFormat(timeStamp) {   
    let time = new Date(timeStamp);
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate()
    return year + '-' + buLing(month) + '-' + buLing(day)   
}

/**
 * 补零方法
 */
function buLing(str){
    if ( str < 10 ) {
        return '0' + str
    } else {
        return str
    }
}

/**
 * 去span标签公用方法
 */
 export function deleteSpan(str){
     console.log(str);
    let replaceReg = new RegExp('<span class="searchText">(.*?)<\/span>', 'g');
    return str.replace(replaceReg, '$1');
 }