import { _ } from "./util"
import CodeMirror from "../../node_modules/codemirror/lib/codemirror.js"
import "../../node_modules/codemirror/lib/codemirror.css"
import "../../node_modules/codemirror/mode/javascript/javascript.js"
import "../../node_modules/codemirror/theme/xq-light.css"

export default class CodeRunner {
    constructor(selector) {
        this.selector = selector;
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
        const code = await this.getCode(_.$All(".CodeMirror-line"));
        console.log(code)
        const log = await this.extractConsoleLog(code);
        console.log(log)
        const bracketItems = await this.extractLogInnerItems(log);
        console.log(bracketItems)
        await this.addInnerHtmlCode(bracketItems);
        console.log(this.code)
        this.runCode(this.code);
    }

    getCode(lines) {
        const code = [];
        lines.forEach(v => {
            const ascCode = v.innerText.charCodeAt();
            ascCode !== 8203 ? code.push(v.innerText + "\n") : null
        });
        this.code = code.join("");
        return code
    }

    extractConsoleLog(code) {
        const consoleLog = [];
        code.forEach((v) => { v.includes("console.log") ? consoleLog.push(v) : null })
        return consoleLog
    }

    extractLogInnerItems(log) {
        let bracketItem = [];
        const bracketInnerItem = [];
        const matchRegExp = /\(.*\)/gi;
        const removeBracketRegExp = /[\(\)]/gi;

        log.forEach((v) => bracketItem.push(_.match(v, matchRegExp)));
        bracketItem = bracketItem.join().split(",");

        bracketItem.forEach((v) => bracketInnerItem.push(_.replace(v, removeBracketRegExp, "")))
        return bracketInnerItem
    }

    addInnerHtmlCode(items) {
        this.code += `document.querySelector('.console').innerHTML = "";\n`
        items.forEach(item => {
            //item이 위의 것을 참조하지 못함.
            this.code += `document.querySelector('.console').innerHTML += '<div>> ${typeof item} ${item}</div>';\n`
        })
    }

    runCode(code) {
        eval(code);
    }
}