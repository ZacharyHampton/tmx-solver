const types = require("@babel/types");


function simplify_ternary_operator(node) {
    if(node.parent.type !== "ConditionalExpression") return;

    const new_node = types.stringLiteral(node.parent.consequent.value);
    node.parentPath.replaceWith(new_node);
}

module.exports = {
    simplify_ternary_operator
}