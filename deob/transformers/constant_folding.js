const t = require('@babel/types');


const foldConstantsVisitor = {
    BinaryExpression(path) {
        let { confident, value } = path.evaluate(); // Evaluate the binary expression
        if (!confident) return; // Skip if not confident
        let actualVal = t.valueToNode(value); // Create a new node, infer the type
        if (!t.isLiteral(actualVal)) return; // Skip if not a Literal type (e.g. StringLiteral, NumericLiteral, Boolean Literal etc.)
        path.replaceWith(actualVal); // Replace the BinaryExpression with the simplified value
    },
};

module.exports = {
    foldConstantsVisitor
}