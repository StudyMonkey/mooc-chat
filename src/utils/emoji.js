import data from '../data/emoji-data.js'
let emojiData = {}
Object.values(data).forEach(item => {
  emojiData = { ...emojiData, ...item }
})

/**
 * @export
 * @param {string} value
 * @returns {string}
 */

export function emoji (value) {
  if (!value) return
  Object.keys(emojiData).forEach(item => {
    value = value.replace(new RegExp(item, 'g'), createIcon(item))
  })
  return value
}

function createIcon (item) {
  const value = emojiData[item]
  const path = './moocChatShow/emoji/'
  let str = ''
  if ( value.lastIndexOf(".gif") > -1 ) {
    str = `<img class="emojiRabbitImg" src=${path}${value} />` 
  } else {
    str = `<img class="emojiImg" src=${path}${value} />`
  }
  return str
}
