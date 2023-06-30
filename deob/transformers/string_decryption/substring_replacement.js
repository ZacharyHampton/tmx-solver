const generate = require("@babel/generator").default;
const vm = require("vm");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const babel = require("@babel/core");


function isHex(h) {
    return /^[0-9A-F]+$/i.test(h);
}

String.prototype.addSlashes = function()
{
    //no need to do (str+'') anymore because 'this' can only be a string
    return this.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function createSandbox(ast) {
    const lines = ast.program.body[0].expression.callee.body.body.filter((n, i) => i >= 0 && i < 5).map((n) => generate(n).code).join(`\n`);
    const context = {};

    vm.runInNewContext(lines, context);

    return context;
}

function decrypt_hex_string(ast) {
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
            console.log(`Decrypted ${full_function_name} to ${decrypted_string}`);
        }
    }

    traverse(ast, functionNameVisitor);

    return calls_to_replace;
}

function replace_hex_substrings(ast) {
    const calls_to_replace = decrypt_hex_string(ast);

    const substringVisitor = {
        MemberExpression(node) {
            if (node.container.start === 0) return;

            const full_function_name = generate(node.parentPath.node).code;

            if (calls_to_replace.hasOwnProperty(full_function_name)) {
                if (generate(node.parentPath.parentPath.node).code.includes("typeof")) return;

                const full_call = node.parentPath.parentPath.node;
                const substring_numbers = full_call.arguments.map((n) => parseInt(n.value));
                const decrypted_string = calls_to_replace[full_function_name];

                let replacement_string = "null";
                try {
                    replacement_string = decrypted_string.substr(substring_numbers[0], substring_numbers[1]).addSlashes();
                } catch (e) {}
                // replace full_call node with string
                node.parentPath.parentPath.replaceWithSourceString(`"${replacement_string}"`);

                console.log(`Replaced ${full_function_name} with "${replacement_string}"`);
            }
        }
    }

    traverse(ast, substringVisitor);
}

module.exports = {
    replace_hex_substrings
};