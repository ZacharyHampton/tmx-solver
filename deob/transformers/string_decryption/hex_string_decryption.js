const generate = require("@babel/generator").default;
const vm = require("vm");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const babel = require("@babel/core");


function isHex(h) {
    return /^[0-9A-F]+$/i.test(h);
}

function createSandbox(ast) {
    const lines = ast.program.body[0].expression.callee.body.body.filter((n, i) => i >= 0 && i < 5).map((n) => generate(n).code).join(`\n`);
    const context = {};

    vm.runInNewContext(lines, context);

    return context;
}

function stringToObject(ast) {
    const sandbox = createSandbox(ast);

    const calls_to_replace = [];

    const functionNameVisitor = {
        NewExpression(path) {
            const arguments = path.node.arguments;

            if (arguments.length !== 1) return;

            const argument = arguments[0];

            if (argument.type !== "StringLiteral") return;

            if (!isHex(argument.value)) return;

            const code = generate(path.node).code;
            const result = vm.runInNewContext(code, sandbox)

            let empty_string_key = undefined;
            let function_name = undefined;

            for (const key in result) {
                if (typeof result[key] === "function") {
                    result[key](0, 0);
                    break;
                }

                if (result[key] === "") {
                    empty_string_key = key;
                }
            }

            if (empty_string_key === undefined) {
                console.log(`Could not find decryption function for ${code}`);
                return;
            }

            const decrypted_string = result[empty_string_key];

            console.log(`Decrypted ${code} to ${decrypted_string}`);

            // find all references to parent, then delete node
            const parent = path.parentPath;
        }
    }

    traverse(ast, functionNameVisitor);
}

module.exports = {
    stringToObject
};