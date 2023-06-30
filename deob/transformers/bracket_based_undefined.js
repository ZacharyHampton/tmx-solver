const types = require("@babel/types");


const bracketBasedUndefinedVisitor = {
    BinaryExpression(path) {
        const left = path.get("left");
        const right = path.get("right");

        if (left.type !== "MemberExpression" || right.type !== "StringLiteral") return;

        const left_object = left.get("object");
        const left_property = left.get("property");

        if (left_object.node.elements === undefined || !left_property.node.elements === undefined) return;
        if (left_object.node.elements.length !== 0 && left_property.node.elements.length !== 0) return;

        if (right.node.value !== "") return;

        path.replaceWith(types.stringLiteral("undefined"));
    }
}

module.exports = {
    bracketBasedUndefinedVisitor
}