let variable_name = undefined;

const fake_variable_overwrite_visitor = {
    VariableDeclarator(path) {
        if (variable_name === undefined) {
            variable_name = path.node.id.name;
        } else {
            if (variable_name === path.node.id.name) {
                path.remove();
            }
        }
    }
}

module.exports = {
    fake_variable_overwrite_visitor
}