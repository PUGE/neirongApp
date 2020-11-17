// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const ipcRenderer = require('electron').ipcRenderer



const serverIP = 'http://49.232.216.171:8006/'
// const serverIP = 'http://127.0.0.1:8006/'
let findList = {}
let findListArr = []
function getErrorTypeText (errorCode) {
  switch (errorCode) {
    case 'Polity':
      return '政治'
      break;
    case 'Illegal':
      return '违法'
      break;
    case 'Porn':
      return '色情'
      break;
    case 'Abuse':
      return '粗俗'
      break;
    case 'Terror':
      return '恐怖'
      break;
    case 'Standard':
      return '错误表述'
      break;
    case 'Ad':
      return '广告'
      break;
    case 'XiYu':
      return '/重要句子'
      break;
    default:
      return errorCode
      break;
  }
}

function chengyuBaseHandle (htmlData, data) {
  data.forEach(item => {
    if (!findList[item['text']]) {
      findList[item['text']] = item
      findListArr.push(item)
      item.type = '正确成语'
      item.tips = `<h2 style="font-size: 20px;">${item['text']}</h2><h2 style="font-size: 20px;">[${item['pinyin2']}]</h2><p>释义：${item['interpretation']}</p><p>出处：${item['source']}</p><p>示例：${item['example']}</p>`
      // 如果词的类型为政治词语，不一致为错误，其他类型不一致为对应类型
      htmlData = htmlData.replace(new RegExp(item['text'], "gm"), `<span data-ind="${findListArr.length}" class="nrsh chengyu chengyu-base">${item['text']}</span>`)
    }
  })
  return htmlData
}

function chengyuPinyinHandle (htmlData, data) {
  // console.log(htmlData)
  
  data.forEach(item => {
    if (!findList[item['like']]) {
      findList[item['like']] = item
      findListArr.push(item)
      item.type = '错误成语'
      item.tips = `<h2 style="font-size: 20px;">${item['text']}</h2><h2 style="font-size: 20px;">[${item['pinyin2']}]</h2><p>释义：${item['interpretation']}</p><p>出处：${item['source']}</p><p>示例：${item['example']}</p>`
      // 如果词的类型为政治词语，不一致为错误，其他类型不一致为对应类型
      htmlData = htmlData.replace(new RegExp(item['like'], "gm"), `<span data-ind="${findListArr.length}" class="nrsh chengyu chengyu-like">${item['like']}</span>`)
    }
  })
  return htmlData
}

function baseHandle (htmlData, data) {
  // console.log(htmlData)
  data.forEach(item => {
    if (!findList[item['text']]) {
      findList[item['text']] = item
      findListArr.push(item)
      if (item.type === 'Standard') {
        htmlData = htmlData.replace(new RegExp(item['text'], "gm"), `<span data-ind="${findListArr.length}" class="nrsh base Standard">${item['text']}</span>`)
      } else {
        htmlData = htmlData.replace(new RegExp(item['text'],"gm"), `<span data-ind="${findListArr.length}" class="nrsh base ${item.type}">${item['text']}</span>`)
      }
    }
  })
  return htmlData
}

function pinyinHandle (htmlData, data) {
  // console.log(data)
  data.forEach(item => {
    if (!findList[item['like']]) {
      findList[item['like']] = item
      findListArr.push(item)
      // 如果词的类型为政治词语，不一致为错误，其他类型不一致为对应类型
      if (item.type === 'Polity') {
        htmlData = htmlData.replace(new RegExp(item['like'], "gm"), `<span data-ind="${findListArr.length}" class="nrsh like error">${item['like']}</span>`)
      } else {
        htmlData = htmlData.replace(new RegExp(item['like'], "gm"), `<span data-ind="${findListArr.length}" class="nrsh like ${item.type}">${item['like']}</span>`)
      }
    }
  })
  return htmlData
}

function networkHandle (htmlData, data) {
  // console.log(data)
  data.forEach(item => {
    if (!findList[item['HitInfo']]) {
      findList[item['HitInfo']] = item
      findListArr.push(item)
      htmlData = htmlData.replace(new RegExp(item['HitInfo'],"gm"), `<span data-ind="${findListArr.length}" class="nrsh">${item['HitInfo']}</span>`)
    } else {
      console.log(`${item['HitInfo']} 已被找出，跳过词语!`)
    }
  })
  return htmlData
}

function regexpHandle (htmlData, data) {
  data.forEach(item => {
    if (!findList[item['like']]) {
      findList[item['like']] = item
      findListArr.push(item)
      if (item['likeNumber'] != 100) {
        item.type = '疑似错误'
        htmlData = htmlData.replace(new RegExp(item['like'], "gm"), `<span data-ind="${findListArr.length}" class="nrsh regexp regexp-like">${item['like']}</span>`)
      } else {
        htmlData = htmlData.replace(new RegExp(item['like'], "gm"), `<span data-ind="${findListArr.length}" class="nrsh regexp XiYu">${item['like']}</span>`)
      }
    }
  })
  return htmlData
}


function addCssByLink() { 
 
  var doc=document; 

  var link=doc.createElement("link"); 

  link.setAttribute("rel", "stylesheet"); 

  link.setAttribute("type", "text/css"); 

  link.setAttribute("href", 'https://demos.run/core.css'); 

  var heads = doc.getElementsByTagName("head"); 

  if (heads.length) {
    heads[0].appendChild(link); 
  }
  else{
    doc.documentElement.appendChild(link); 
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // const replaceText = (selector, text) => {
  //   const element = document.getElementById(selector)
  //   if (element) element.innerText = text
  // }

  // for (const type of ['chrome', 'node', 'electron']) {
  //   replaceText(`${type}-version`, process.versions[type])
  // }
  
  var insertElement = document.createElement("div");
  insertElement.classList.add('neirong-box')
  insertElement.innerHTML = `<div class="neirong-top"><input type="text" class="neirong-text" value="http://www.people.com.cn/" placeholder="输入网址链接"><div class="neirong-button neirong-button-1">转到</div><div class="neirong-button neirong-button-2">检查</div></div><div class="neirong-bottom"><input id="neirongAutoReload" type="checkbox" name="autoReload" value="自动刷新"/><span>每隔</span><input type="number" value="60"><span>秒自动刷新页面</span>  <input id="neirongAlert" type="checkbox" name="autoReload" value=""/><span>网页内容变更提醒</span><input id="neirongErrorAlert" type="checkbox" name="autoReload" value=""/><span>疑似错误提醒</span></div>`
  document.body.appendChild(insertElement);
  var insertElement2 = document.createElement("div");
  insertElement2.classList.add('neirong-show')
  document.body.appendChild(insertElement2);
  function checkConn () {
    let TextArr = []
    document.querySelectorAll('a').forEach(element => {
      TextArr.push(element.innerText)
    });
    document.querySelectorAll('p').forEach(element => {
      if (!element.querySelector('a')) {
        TextArr.push(element.innerText)
      }
    });
    let checkData = TextArr.join("*&*")
    checkData = checkData.replace(/\r/g, '')
    checkData = checkData.replace(/\n/g, '')
    checkData = checkData.replace(/ /g, '')
    // 发送检查请求
    fetch(serverIP + "check", {
      method: 'POST',
      body: JSON.stringify({"config": {
        "network": false,
        "pinyin": true,
        "base": true,
        "yange": false,
        "chengyuBase": false,
        "chengyuPinyin": false,
        "mohu": true,
        "xiyu": true,
        // "hideRight": true,
        // "log": true,
        // "likeAlertNumber": 90
      },"content": checkData})
    }).then(response => response.json()).then(result => {
      let htmlData = document.body.innerHTML
      
      const data = result['data']
      // console.log(htmlData)
      // 先进行基础审查
      if (data['regexp'] && data['regexp'].length > 0) {
        console.log('使用正则纠错!')
        htmlData = regexpHandle(htmlData, data['regexp'])
      }
      htmlData = baseHandle(htmlData, data['base'])
      
      if (data['network']) {
        console.log('使用云词库!')
        htmlData = networkHandle(htmlData, data['network'])
      }
      if (data['pinyin']) {
        console.log('使用拼音匹配!')
        htmlData = pinyinHandle(htmlData, data['pinyin'])
      }
      if (data['chengyuBase']) {
        console.log('使用成语匹配!')
        htmlData = chengyuBaseHandle(htmlData, data['chengyuBase'])
      }
      if (data['chengyuPinyin'] && data['chengyuPinyin'].length > 0) {
        console.log('使用成语拼音纠错!')
        htmlData = chengyuPinyinHandle(htmlData, data['chengyuPinyin'])
      }
      // console.log(htmlData)
      document.body.innerHTML = htmlData
      // setTimeout(() => {
      //   this.reHandleEvent()
      //   this.query('.loading').style.display = 'none'
      //   owo.tool.remind('点击高亮的关键词显示对应信息!', 2000)
      // }, 100);
      const neirongShow = document.querySelector('.neirong-show')
      neirongShow.style.display = 'block'
      setTimeout(() => {
        // 清理嵌套
        document.querySelectorAll('.nrsh .nrsh').forEach(element => {
          element.outerHTML = element.innerText
        });
        setTimeout(() => {
          document.querySelectorAll('.nrsh').forEach(element => {
            element.addEventListener("mouseenter", (e) => {
              const ind =  parseInt(e.target.getAttribute("data-ind"))
              const data = findListArr[ind - 1]
              if (!data) return
              let newHtml = '<div class="neirong-title">详细信息</div>'
              if (data.like) {
                newHtml += `${data.like}<br>正确的文字可能为: ${data.text}`
              } else {
                newHtml += `${data.text}<br>正确关键词！`
              }
              if (data.likeNumber) {
                newHtml += `相似度: ${data.likeNumber}%<br>`
              }
              if (data.tips) {
                newHtml += `<div class="neirong-info">${data.tips}</div>`
              }
              
              neirongShow.innerHTML = newHtml
              
            })
          });
        }, 100);
      }, 0);
      // console.log(findListArr)
      reInit()
    })
    .catch(error => console.log('error', error));
  }
  function reInit() {
    // 切换网址
    document.querySelector('.neirong-button-1').addEventListener('click',function(){
      const urlStr = document.querySelector('.neirong-text').value
      console.log(urlStr)
      ipcRenderer.sendSync('changeUrl', {
        url: urlStr
      })
    },false)
    // 检查内容
    document.querySelector('.neirong-button-2').addEventListener('click',checkConn,false)
  }
  setTimeout(() => {
    addCssByLink()
    reInit()
  }, 0);
})
