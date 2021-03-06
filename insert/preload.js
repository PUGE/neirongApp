// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
try {
  window.nodeRequire = require;
}
catch(err) {
  console.log("不需要删除");
}
delete window.require;
delete window.exports;
delete window.module;


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

function addScr () {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.charset = "UTF-8";
  script.src = "http://cunchu.site/app/neirong/neirongCore.js";
  document.body.appendChild(script)
}

window.addEventListener('DOMContentLoaded', () => {
  // 所有链接当前窗口打开
  document.querySelectorAll('a').forEach(element => {
    element.setAttribute('target', '_self')
  });
  document.querySelectorAll('[alt]').forEach(element => {
    element.setAttribute('alt', '')
  });
  document.querySelectorAll('[title]').forEach(element => {
    element.setAttribute('title', '')
  });
  // const replaceText = (selector, text) => {
  //   const element = document.getElementById(selector)
  //   if (element) element.innerText = text
  // }

  // for (const type of ['chrome', 'node', 'electron']) {
  //   replaceText(`${type}-version`, process.versions[type])
  // }
  
  var insertElement = document.createElement("div");
  insertElement.classList.add('neirong-box')
  insertElement.innerHTML = `
  <div class="title-bar">
    <div class="back neitong-title-item" onclick="window.history.go(-1)"><span class="icon">&#xe711;</span>返回</div>
    <div class="reload neitong-title-item" onclick="location.reload()"><span class="icon">&#xe602;</span>刷新</div>
    <div id="modalbox" class="neirong-search"><input type="text" id="neirongSearchInput"><span class="neirong-button" onclick="neirongSearch()">搜索</span></div>
  </div>
  <div class="neirong-top">
    <input type="text" class="neirong-text" value="http://cms.peopleurl.cn/cms/ChannelView.shtml?id=405210" placeholder="输入网址链接">
    <div class="neirong-button neirong-button-1" onclick="changeURL()">转到</div><div id="checkButton" class="neirong-button neirong-button-2" onclick="checkConn()">检查</div>
  </div>
  <div class="neirong-bottom">
    <input id="neirongAutoReload" type="checkbox" name="autoReload" onchange="changeConfig('autoReload', event)" value="自动刷新"/>
    <span>每隔</span>
    <input type="number" id="reloadNum" onchange="changeConfigNum('reloadNum', event)" value="60">
    <span>秒自动刷新页面</span>
    <input id="autoCheck" type="checkbox" name="autoReload" onchange="changeConfig('autoCheck', event)" value=""/>
    <span>自动检测页面</span>
    <div class="neirong-number-info"></div>
  </div>`
  document.body.appendChild(insertElement);
  var insertElement2 = document.createElement("div");
  insertElement2.classList.add('neirong-show')
  document.body.appendChild(insertElement2);
  setTimeout(() => {
    addScr()
    addCssByLink()
    document.querySelector('.neirong-text').value = window.location.href
  }, 0);
})
