const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const path = "../index.html"
JSDOM.fromFile(path)
    .then((dom) => {
        return dom.serialize()
    })
    .then(html => {
        console.log(new JSDOM(`${html}`).window.document.querySelector('#scrollBox').innerHTML)
    })

// node.js 실행결과 : console.log("hello world")
// 리다이렉션 후 node.js실행하면 원하는 코드 실행 결과 얻기 가능
