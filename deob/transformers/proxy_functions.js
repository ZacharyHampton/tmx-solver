const t = require("@babel/types");
const generate = require("@babel/generator").default

const proxyVisitor = {
    FunctionDeclaration(path) {
        const {node, scope} = path;
        const {id, body, params} = node;
        // is 1 liner return, return calls a func or logical operator
        if (!t.isReturnStatement(body.body[0])) return;
        const proxyExpression = body.body[0].argument;
        if (
            !t.isCallExpression(proxyExpression) &&
            !t.isLogicalExpression(proxyExpression)
        ) return;


        //get lines where proxy func is called
        const { referencePaths } = scope.getBinding(id.name);
        for (let referencePath of referencePaths) {
            let { parentPath } = referencePath;
            var args = parentPath.node.arguments.map(arg => generate(arg).code);
            var funcParams = params.map(param => param.name);
            for (let param of funcParams) {
                var paramNodes = scope.getBinding(param).referencePaths;
                for (let node of paramNodes) {
                    node.node.name = args;
                }
            }
            var EvaluatedValue = generate(proxyExpression).code;
            parentPath.replaceWith(t.valueToNode(EvaluatedValue));
            console.log("replaced" + EvaluatedValue)
            }
        path.remove()
        console.log("removed func" + id.name)
    }
}
module.exports = {
    proxyVisitor
}