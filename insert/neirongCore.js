const ipcRenderer = require('electron').ipcRenderer
var Datastore = require('nedb'), db = new Datastore({ filename: 'path/to/datafile', autoload: true });
// 内容智能学习
const serverIP = 'http://49.232.216.171:8006/'

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

db.findOne({ name: 'config' }, function (err, doc) {
  console.log(doc)
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
  startAutoReload()
}
