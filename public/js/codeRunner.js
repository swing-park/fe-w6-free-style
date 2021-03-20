import { _ } from "./util"
import CodeMirror from "../../node_modules/codemirror/lib/codemirror.js"
import "../../node_modules/codemirror/lib/codemirror.css"
import "../../node_modules/codemirror/mode/javascript/javascript.js"
import "../../node_modules/codemirror/theme/xq-light.css"

export default class CodeRunner {
    constructor(selector) {
        this.selector = selector;
        this.returnCode = [];
        this.code;
    }

    insertCodeMirror() {
        const codeMirror = CodeMirror.fromTextArea(this.selector, {
            mode: "javascript",
            theme: "xq-light",
            lineNumbers: true,
        });
        codeMirror.setSize("100%", "100%");
    }

    async init() {
        const code = this.getCode(_.$All(".CodeMirror-line"));
        const log = this.extractConsoleLog(code);
        const bracketItems = this.extractLogInnerItems(log);
        const returnItems = this.addReturnCode(bracketItems)
        const returnCode = this.getReturnCode(returnItems);
        this.addInnerHtmlCode(returnCode);
        this.runCode(this.code)
    }

    eventHandler() {
        _.on(_.$(".runButton"), "click", this.init.bind(this))
        _.on(_.$(".resetButton"), "click", this.reset.bind(this))
    }

    getCode(lines) {
        const code = [];
        lines.forEach(v => {
            const ascCode = v.innerText.charCodeAt();
            ascCode === 8203 ? null : code.push(v.innerText + "\n")
        });
        this.code = code.join("");
        return code
    }

    extractConsoleLog(code) {
        const consoleLog = [];
        code.forEach(v => { !v.includes("console.log") ? this.returnCode.push(v) : consoleLog.push(v) })
        return consoleLog
    }

    extractLogInnerItems(log) {
        const matchRegExp = /\(.*\)/gi;
        const removeBracketRegExp = /[\(\)]/gi;

        const bracketItem = log.map(v => _.match(v, matchRegExp)).join().split(",");
        const bracketInnerItem = bracketItem.map(v => _.replace(v, removeBracketRegExp, ""));
        return bracketInnerItem
    }

    addReturnCode(items) {
        return this.returnCode.join("") + `return [${items}]`;
    }

    getReturnCode(returnCode) {
        return eval(`(function(){${returnCode}})();`);
    }

    addInnerHtmlCode(items) {
        this.code += `document.querySelector(".console").innerHTML = "";\n`
        items.forEach(item => {
            this.code += `document.querySelector(".console").innerHTML += '<div>> ${typeof item} ${item}</div>';\n`
        })
    }

    runCode(code) {
        eval(code)
    }

    reset() {
        console.log("reset")
    }
}

/*현재 버그

- console.log(a,b)할 시 줄 나뉨
- 반복문 같은거에 반응이 한번밖에 안됨
*/