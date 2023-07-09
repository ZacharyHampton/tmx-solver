const vm = require('vm');
const {template} = require("@babel/core");
const generate = require("@babel/generator").default;


const evalReplacementVisitor = {
    CallExpression(path) {
        if (path.node.callee.name === 'eval') {
            // run eval arg thru vm, replace with result (only works as antibot has unescape call in the eval)

            const argument = path.node.arguments[0];
            const code = generate(argument).code;

            const result = vm.runInNewContext(code, {});
            // parse result as ast
            const replacement_node = template.statement.ast`${result}`;

            path.replaceWith(replacement_node);
        }
    }
}

module.exports = {
    evalReplacementVisitor
}