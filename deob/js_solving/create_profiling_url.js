const parser = require("@babel/parser");
const vm = require("vm");

function generate_string_params(params) {
    const parameters = params.map((param) => {
        return `'${param}'`;
    });

    return `(${parameters.join(", ")})`;
}

function create_profiling_url(message, callback) {
    if (message.request.script == null) {
        return {
            error: "No script provided"
        }
    }

    const script = message.request.script;

    const ast = parser.parse(script);

    // run script in vm
    const context = vm.createContext({});
    vm.runInContext(script, context);

    // get first function name
    const first_line = ast.program.body[0];
    const first_function_name = first_line.declarations[0].id.name;

    if (first_line.declarations[0].init.type !== "LogicalExpression") {
        return {
            error: "Failed to validate script."
        }
    }

    const params = [message.request.hostname, ".js", ...message.request.params, ""];
    const create_url_script = `${first_function_name}.create_url${generate_string_params(params)}`;
    // call first_line.create_url function with parameters in vm
    const url = vm.runInContext(create_url_script, context);

    callback(null, {
        url: url
    })
}

module.exports = {
    create_profiling_url
}