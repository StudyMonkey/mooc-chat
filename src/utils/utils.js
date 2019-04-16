import axios from 'axios'

export function getData(url, data){
    return new Promise( (resolve, reject) => {
        axios.get(url, data).then( res => {
            return resolve(res)
        }).then( err => {
            return reject(err)
        })
    })
}