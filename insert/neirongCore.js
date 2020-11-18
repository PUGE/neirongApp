
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