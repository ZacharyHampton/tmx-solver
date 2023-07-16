const t = require("@babel/types");


// Visitor for simplifying if statements and logical statements
const simplifyIfAndLogicalVisitor = {
    "ConditionalExpression|IfStatement"(path) {
      let { consequent, alternate } = path.node;
      let testPath = path.get("test");
      const value = testPath.evaluateTruthy();
      if (value === true) {
        if (t.isBlockStatement(consequent)) {
          consequent = consequent.body;
        }
        path.replaceWithMultiple(consequent);
      } else if (value === false) {
        if (alternate != null) {
          if (t.isBlockStatement(alternate)) {
            alternate = alternate.body;
          }
          path.replaceWithMultiple(alternate);
        } else {
          path.remove();
        }
      }
    },
};

module.exports = {
    simplifyIfAndLogicalVisitor
}