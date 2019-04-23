import axios from 'axios'

const uri = 'https://www.easy-mock.com/mock/5cb7d8990b31727f3d58120a/mooc-chat/'

export function getData(url, data){
    return new Promise( (resolve, reject) => {
        axios.get(uri+url, data).then( res => {
            return resolve(res)
        }).then( err => {
            return reject(err)
        })
    })
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