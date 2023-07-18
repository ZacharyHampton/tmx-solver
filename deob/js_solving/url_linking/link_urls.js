const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const { tag_reference } = require("./tagging/tagging");

function link_urls(link_message, callback) {
    const script = link_message.request.script;
    const script_type = link_message.request.script_type;

    if (script === "null") {
        callback(null, {urls: new Map(), error: "No script provided."})
        return;
    }

    const ast = parser.parse(script);
    const urls = {};

    traverse(ast, {
        AssignmentExpression(path) {
            // if value of variable is a string & is an url
            if (
                path.node.right.type === "StringLiteral" &&
                path.node.right.value.startsWith("http")
            ) {
                const url = path.node.right.value;
                const left = path.get("left");
                const left_name = generate(left.node).code

                let identifier;
                let references;

                switch (left.node.type) {
                    case "Identifier":
                        identifier = left;
                        references = path.scope.getBinding(identifier.node.name).referencePaths;

                        break;
                    case "MemberExpression":
                        const object_binding = left.get("object");

                        references = path.scope.getBinding(object_binding.node.name).referencePaths;

                        references = references.filter((reference) => {
                            return (
                                reference.parentPath.node.type === "MemberExpression" &&
                                reference.parentPath.node.property.name === left.node.property.name
                            )
                        })

                        break;
                    default:
                        return;
                }

                if (references.length <= 1) {
                    return;
                }

                for (const reference of references) {
                    const tag = tag_reference(reference, script_type);

                    if (!tag) continue;

                    // console.log(tag, left_name, url)

                    if (!urls[tag]) {
                        urls[tag] = url;
                    } else {
                        console.log("Duplicate tag: " + tag)
                    }
                }
            }
        }
    })

    callback(null, {urls: urls, error: "", script_type: script_type})
}

module.exports = {
    link_urls
}