const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const { tag_reference } = require("./tagging/tagging");
const t = require("@babel/types");

function link_urls(link_message, callback) {
    const script = link_message.request.script;
    const script_type = link_message.request.script_type;

    if (script === "null") {
        callback(null, {urls: new Map(), error: "No script provided."})
        return;
    }

    const ast = parser.parse(script, {
        strictMode: false,
        errorRecovery: true,
    });
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
                let necessary_length = 0;

                switch (left.node.type) {
                    case "Identifier":
                        identifier = left;
                        references = path.scope.getBinding(identifier.node.name);

                        if (!references) {
                            references = [];
                            traverse(ast, {
                                Identifier(path) {
                                    if (path.node.name === identifier.node.name && path.parent.type !== "AssignmentExpression") {
                                        references.push(path)
                                    }
                                }
                            })
                        } else {
                            references = references.referencePaths;
                        }

                        necessary_length = 0;

                        break;
                    case "MemberExpression":
                        const object_binding = left.get("object");

                        references = path.scope.getBinding(object_binding.node.name).referencePaths;
                        necessary_length = 1;

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

                if (references.length <= necessary_length) {
                    return;
                }

                for (const reference of references) {
                    let tag;

                    if (url.includes("/fp/clear.png")) {
                        tag = "embedded_image_fp_clear_png"
                    } else if (url.includes('d.aa.online-metrix')) {
                        tag = "embedded_img_online_metrix"
                    } else {
                        tag = tag_reference(reference, script_type);
                    }

                    if (!tag) continue;

                    // console.log(tag, left_name, url)

                    if (!urls[tag]) {
                        urls[tag] = {"urls": [url]};
                    } else {
                        if (!urls[tag]["urls"].includes(url)) {
                            switch (tag) {
                                case "lsa_payload":
                                    continue;
                                case "main_url_payload":
                                    continue;
                                default:
                                    break;
                            }

                            urls[tag]["urls"].push(url);
                        } else {
                            // console.log("Duplicate url:", url)
                        }
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