const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

function link_urls(link_message, callback) {
    const script = link_message.request.script;

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
                    const tag = tag_reference(reference);

                    if (!tag) continue;

                    console.log(tag, left_name, url)

                    if (!urls[tag]) {
                        urls[tag] = url;
                    } else {
                        console.log("Duplicate tag: " + tag)
                    }
                }

            }
        }
    })

    callback(null, {urls: urls, error: ""})
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

function tag_reference(path) {
    const ideal_part = recursive_til_parent_body(path);

    if (ideal_part === false) {
        return null;
    }

    const ideal_code = generate(ideal_part.node).code;  // for debugging

    try {  // embedded_image
        const previous_sibling = ideal_part.getPrevSibling();
        const code = generate(previous_sibling.node).code;

        if (code.includes('createElement("img");')) {
            return "init,embedded_image"
        }
    } catch {}

    try {  // tmx_tags_iframe_src
        if (
            ideal_part.parent.type === "BlockStatement" &&
            ideal_part.parentPath.parent.type === "CatchClause" &&
            ideal_part.parentPath.parentPath.parent.type === "TryStatement"
        ) {
            const code = generate(ideal_part.parentPath.parentPath.parentPath.node).code

            if (code.includes('contentWindow.document')) {
                return "init,tmx_tags_iframe_src"
            }
        }
    } catch {}

    try {  // fcjs
        if (
            ideal_part.parent.type === "BlockStatement" &&
            ideal_part.parentPath.parent.type === "IfStatement" &&
            generate(ideal_part.parentPath.parent.test).code.includes("tmx_tags_iframe_marker")
        ) {
            return "init,fcjs"
        }
    } catch {}

    if (ideal_code.includes('"url(" +')) {
        return "init,p_tag"
    }

    return null;
}

module.exports = {
    link_urls
}