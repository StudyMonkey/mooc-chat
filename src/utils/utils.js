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