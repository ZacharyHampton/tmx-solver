const vm = require('vm');
const generate = require("@babel/generator").default;



const numberToStringVisitor = {
    MemberExpression(node) {
        const property = node.node.property;

        if (!property) return;

        // if identifier and is toString
        if (property.type === "Identifier" && property.name === "toString") {
            let callee = node.parent.callee;

            if (!callee) return;

            if (!callee.hasOwnProperty('object')) return;

            if (callee.object.hasOwnProperty('callee')) {
                let code = generate(node.parent).code;
                let result = vm.runInNewContext(code);

                // replace node parent with string
                node.parentPath.replaceWithSourceString(`"${result}"`);
            }
        }
    }
}

module.exports = {
    numberToStringVisitor
}