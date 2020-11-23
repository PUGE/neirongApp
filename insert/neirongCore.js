const ipcRenderer = require('electron').ipcRenderer
var Datastore = require('nedb'), db = new Datastore({ filename: 'path/to/datafile', autoload: true });
// 内容智能学习
const serverIP = 'http://49.232.216.171:8006/'
const sentenceHideArr = [',', '"', '“', '”', '.', '。', '，']

let findList = {}
let findListArr = []
let rightNum = 0
let errorNum = 0

function changeURL() {
  const urlStr = document.querySelector('.neirong-text').value
  console.log(urlStr)
  ipcRenderer.sendSync('changeUrl', {
    url: urlStr
  })
}


function chengyuBaseHandle (htmlData, data) {
  data.forEach(item => {
    if (!findList[item['text']]) {
      findList[item['text']] = item
      findListArr.push(item)
      item.type = '正确成语'
      item.tips = `<h2 style="font-size: 20px;">${item['text']}</h2><h2 style="font-size: 20px;">[${item['pinyin2']}]</h2><p>释义：${item['interpretation']}</p><p>出处：${item['source']}</p><p>示例：${item['example']}</p>`
      // 如果词的类型为政治词语，不一致为错误，其他类型不一致为对应类型
      htmlData = htmlData.replace(new RegExp(item['text'], "gm"), `<nrsh data-ind="${findListArr.length}" class="nrsh chengyu chengyu-base">${item['text']}</nrsh>`)
      rightNum++
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
      const startPos = htmlData.indexOf(item['like'])
      const startStr = htmlData.slice(startPos - 1, startPos)
      const endStr = htmlData.slice(startPos + item['text'].length, startPos + item['text'].length + 1)
      item.sentence = []
      if (!sentenceHideArr.includes(startStr)) {
        item.sentence.push(startStr + item['like'])
      }
      if (!sentenceHideArr.includes(endStr)) {
        item.sentence.push(item['like'] + endStr)
      }
      item.sentenceStr = htmlData.slice(startPos - 4, startPos + item['text'].length + 4)
      item.tips = `<h2 style="font-size: 20px;">${item['text']}</h2><h2 style="font-size: 20px;">[${item['pinyin2']}]</h2><p>释义：${item['interpretation']}</p><p>出处：${item['source']}</p><p>示例：${item['example']}</p>`
      // 如果词的类型为政治词语，不一致为错误，其他类型不一致为对应类型
      htmlData = htmlData.replace(new RegExp(item['like'], "gm"), `<nrsh data-ind="${findListArr.length}" class="nrsh chengyu chengyu-like">${item['like']}</nrsh>`)
      errorNum++
      errorArr.push(item)
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
        htmlData = htmlData.replace(new RegExp(item['text'], "gm"), `<nrsh data-ind="${findListArr.length}" class="nrsh base Standard">${item['text']}</nrsh>`)
      } else {
        htmlData = htmlData.replace(new RegExp(item['text'],"gm"), `<nrsh data-ind="${findListArr.length}" class="nrsh base ${item.type}">${item['text']}</nrsh>`)
      }
      rightNum++
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
      const startPos = htmlData.indexOf(item['like'])
      const startStr = htmlData.slice(startPos - 1, startPos)
      const endStr = htmlData.slice(startPos + item['text'].length, startPos + item['text'].length + 1)
      item.sentence = []
      if (!sentenceHideArr.includes(startStr)) {
        item.sentence.push(startStr + item['like'])
      }
      if (!sentenceHideArr.includes(endStr)) {
        item.sentence.push(item['like'] + endStr)
      }
      item.sentenceStr = htmlData.slice(startPos - 4, startPos + item['text'].length + 4)
      // 如果词的类型为政治词语，不一致为错误，其他类型不一致为对应类型
      if (item.type === 'Polity') {
        htmlData = htmlData.replace(new RegExp(item['like'], "gm"), `<nrsh data-ind="${findListArr.length}" class="nrsh like error">${item['like']}</nrsh>`)
      } else {
        htmlData = htmlData.replace(new RegExp(item['like'], "gm"), `<nrsh data-ind="${findListArr.length}" class="nrsh like ${item.type}">${item['like']}</nrsh>`)
      }
      errorNum++
      errorArr.push(item)
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
      htmlData = htmlData.replace(new RegExp(item['HitInfo'],"gm"), `<nrsh data-ind="${findListArr.length}" class="nrsh">${item['HitInfo']}</nrsh>`)
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
      const startPos = htmlData.indexOf(item['like'])
      const startStr = htmlData.slice(startPos - 1, startPos)
      const endStr = htmlData.slice(startPos + item['text'].length, startPos + item['text'].length + 1)
      item.sentence = []
      if (!sentenceHideArr.includes(startStr)) {
        item.sentence.push(startStr + item['like'])
      }
      if (!sentenceHideArr.includes(endStr)) {
        item.sentence.push(item['like'] + endStr)
      }
      item.sentenceStr = htmlData.slice(startPos - 4, startPos + item['text'].length + 4)
      if (item['likeNumber'] != 100) {
        item.type = '疑似错误'
        htmlData = htmlData.replace(new RegExp(item['like'], "gm"), `<nrsh data-ind="${findListArr.length}" class="nrsh regexp regexp-like">${item['like']}</nrsh>`)
      } else {
        htmlData = htmlData.replace(new RegExp(item['like'], "gm"), `<nrsh data-ind="${findListArr.length}" class="nrsh regexp XiYu">${item['like']}</nrsh>`)
      }
      errorNum++
      errorArr.push(item)
    }
  })
  return htmlData
}

let errorArr = []
function neirongXuexi(index) {
  console.log(errorArr[index])
  // 发送检查请求
  fetch(serverIP + "xuexi", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "xuexi": errorArr[index]['sentence'],
      "id": errorArr[index]['id']
    })
  }).then(response => response.json()).then(result => {
    if (result.err == 0) {
      alert('已经学习关键词使用环境!')
    }
  })
}

function neirongSearch (event) {
  
  const value = document.querySelector('#neirongSearchInput').value
  console.log(value)
  ipcRenderer.send('search-text', value)
}

let webConfig = null
function loadConfig() {
  console.log('获取配置文件!')
  db.findOne({ name: 'config' }, function (err, doc) {
    if (doc) {
      webConfig = doc
      if (webConfig.autoReload) {
        console.log(document.querySelector('#neirongAutoReload'))
        document.querySelector('#neirongAutoReload').checked = true
        startAutoReload()
      }
      if (webConfig.autoCheck) {
        // checkConn()
        document.querySelector('#autoCheck').checked = true
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        document.querySelector('#checkButton').dispatchEvent(e)
      }
    } else {
      webConfig = {
        name: "config",
        autoReload: false,
        autoCheck: false
      }
      db.insert(webConfig)
    }
  })
}

function reLoadConfig() {
  console.log('获取配置文件!')
  db.findOne({ name: 'config' }, function (err, doc) {
    if (doc) {
      webConfig = doc
      if (webConfig.autoReload) {
        document.querySelector('#neirongAutoReload').checked = true
      }
      if (webConfig.autoCheck) {
        // checkConn()
        document.querySelector('#autoCheck').checked = true
      }
    } else {
      webConfig = {
        name: "config",
        autoReload: false,
        autoCheck: false
      }
      db.insert(webConfig)
    }
  })
}

loadConfig()


function startAutoReload () {
  setTimeout(() => {
    console.log('自动刷新')
    console.log(webConfig['autoReload'])
    if (webConfig['autoReload']) window.location.replace("")
  }, 60000);
}

function changeConfig (name, event) {
  console.log(name)
  const check = event.target.checked
  webConfig[name] = check
  console.log(webConfig)
  db.update({ name: 'config' }, webConfig)
}

function checkConn () {
  console.log('点击检查按钮!')
  rightNum = 0
  errorNum = 0
  errorArr = []
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
      "likeAlertNumber": 80
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
    
    setTimeout(() => {
      document.querySelector('.neirong-number-info').innerText = `正确关键词：${rightNum}个 疑似错误：${errorNum}个`
      console.log(errorArr)
      // 如果有错误报警
      if (errorNum > 0) {
        new Audio("https://cunchu.site/app/neirong/ding.mp3").play()
      }
      let errorText = '<div class="neirong-title">疑似错误</div>'
      if (errorArr.length > 0) {
        for (let index = 0; index < errorArr.length; index++) {
          const element = errorArr[index];
          errorText += `<p>关键词 [${element.like}] 疑似为 [${element.text}] <span class="neirong_clear" onclick="neirongXuexi(${index})">学习为无误</span></p>`
        }
      } else {
        errorText = '<div class="neirong-title">未发现疑似错误</div>'
      }
      
      neirongShow.innerHTML = errorText
      neirongShow.style.display = 'block'
      // 清理嵌套
      document.querySelectorAll('.nrsh .nrsh').forEach(element => {
        element.outerHTML = element.innerText
      });
      reLoadConfig()
      setTimeout(() => {
        document.querySelectorAll('.nrsh').forEach(element => {
          element.addEventListener("mouseenter", (e) => {
            const ind =  parseInt(e.target.getAttribute("data-ind"))
            const data = findListArr[ind - 1]
            if (!data) return
            let newHtml = '<div class="neirong-title">详细信息</div>'
            if (data.like) {
              newHtml += `${data.like}<br>正确的文字可能为: ${data.text}<br>`
            } else {
              newHtml += `${data.text}<br>正确关键词！`
            }
            if (data.likeNumber) {
              newHtml += `相似度: ${data.likeNumber}%`
            }
            if (data.tips) {
              newHtml += `<div class="neirong-info">${data.tips}</div>`
            }
            neirongShow.innerHTML = newHtml
          })
        });
      }, 100);
    }, 0);
  })
  .catch(error => console.log('error', error));
}
