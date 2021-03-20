import 'regenerator-runtime/runtime';
import { _ } from "./util";
import CodeRunner from "./codeRunner";

const init = async () => {
    const codeRunner = new CodeRunner(_.$("#codeMirror"));
    codeRunner.insertCodeMirror();
    codeRunner.eventHandler();
};
init();