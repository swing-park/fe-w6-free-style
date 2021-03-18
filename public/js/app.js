import 'regenerator-runtime/runtime';
import { _ } from "./util";
import CodeRunner from "./codeRunner";

const init = async () => {
    const codeRunner = new CodeRunner(_.$("#codeMirror"));
    codeRunner.insertCodeMirror();

    _.on(_.$(".runButton"), "click", codeRunner.init.bind(codeRunner))
};
init();