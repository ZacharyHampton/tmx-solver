const generate = require("@babel/generator").default;


const functionWrapperVisitor = {
    FunctionExpression(path) {
        if (path.parent.type === "CallExpression") {
            const body = path.node.body.body;

            // replace the function with its body
            path.parentPath.parentPath.replaceWithMultiple(body);
        }

        path.stop();
    }
}

module.exports = {
    functionWrapperVisitor
};