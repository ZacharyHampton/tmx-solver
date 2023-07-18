const {default: generate} = require("@babel/generator");
const { profiling_tagging } = require("./profiling");

const tagging_function = {
    "PROFILING": profiling_tagging
}

function recursive_til_parent_body(path) {
    if (path.type === "ExpressionStatement") {
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

    const tag = tagging_function[script_type](ideal_part);
    if (tag) {
        return tag;
    }

    return null;
}

module.exports = {
    tag_reference
}