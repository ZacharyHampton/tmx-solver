const {default: generate} = require("@babel/generator");
const { profiling_tagging } = require("./profiling");
const { main_tagging } = require("./main");
const { iframe_tagging } = require("./iframe");

const tagging_function = {
    "PROFILING": profiling_tagging,
    "MAIN": main_tagging,
    "IFRAME": iframe_tagging
}

function recursive_til_parent_body(path) {
    const code = generate(path.node).code;  // for debug
    // VariableDeclaration
    if (
        path.type === "ExpressionStatement" ||
        (path.type === "VariableDeclaration" && path.parent.type === "BlockStatement")
    ) {
        return path
    }

    if (path.type === "AssignmentExpression") {
        return false
    }

    return recursive_til_parent_body(path.parentPath);
}

function tag_reference(path, script_type) {
    const ideal_part = recursive_til_parent_body(path);

    if (ideal_part === false) {
        return null;
    }

    // const code = generate(ideal_part.node).code;  // for debug

    const tag = tagging_function[script_type](ideal_part);
    if (tag) {
        return tag;
    }

    return null;
}

module.exports = {
    tag_reference
}