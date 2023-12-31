const generate = require("@babel/generator").default;
const vm = require("vm");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const babel = require("@babel/core");
const { simplify_ternary_operator } = require("./ternary_operator");


function isHex(h) {
    return /^[0-9A-F]+$/i.test(h);
}

function createSandbox(ast) {
    let start;

    if (ast.program.body[0].type === "VariableDeclaration") {
        start = ast.program.body;
    } else {
        start = ast.program.body[0].expression.callee.body.body
    }

    // start = ast.program.body;

    const nodes = start.filter((n, i) => i >= 0 && i < 5)
    const lines = nodes.map((n) => generate(n).code).join(`\n`);
    const context = {};

    vm.runInNewContext(lines, context);

    return context;
}

function decrypt_hex_string(ast, fast) {
    const sandbox = createSandbox(ast);
    const calls_to_replace = {};

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

                    function_name = key;

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

            // find all references to parent, then delete node
            let full_function_name = undefined;

            const parent = path.parentPath.node;
            if (parent.type === "VariableDeclarator") {
                full_function_name = `${parent.id.name}.${function_name}`;
            } else {
                const left = parent.left;
                full_function_name = `${left.object.name}.${left.property.name}.${function_name}`;
            }

            calls_to_replace[full_function_name] = decrypted_string;

            if (!fast) {
                path.parentPath.remove();
            }
        }
    }

    traverse(ast, functionNameVisitor);

    return calls_to_replace;
}

function replace_hex_substrings(ast, fast) {
    const calls_to_replace = decrypt_hex_string(ast, fast);

    const substringVisitor = {
        CallExpression(node) {
            const callee = node.get("callee");

            if (!callee) return;

            const code = generate(callee.node).code;

            if (calls_to_replace[code]) {
                const arguments = node.get("arguments");
                if (arguments.length !== 2) return;

                const substring_values = arguments.map((n) => n.node.value);
                const replacement_string = calls_to_replace[code].substr(substring_values[0], substring_values[1]);

                const new_node = types.stringLiteral(replacement_string);
                node.replaceWith(new_node);

                /*if (!fast) {
                    simplify_ternary_operator(node);
                }*/
                simplify_ternary_operator(node);
            }
        }
    }

    traverse(ast, substringVisitor);

    // remove first 4 function declarations

    if (!fast) {
        let count = 0;
        const functionVisitor = {
            ExpressionStatement(path) {
                if (count < 4 && path.node.start !== 0) {
                    count++;
                    path.remove();
                }
            }
        }

        traverse(ast, functionVisitor);
    }
}

module.exports = {
    replace_hex_substrings
};