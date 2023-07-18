const {default: generate} = require("@babel/generator");

function check_for_embedded_image(ideal_part) {
    try {  // embedded_image
        const previous_sibling = ideal_part.getPrevSibling();
        const code = generate(previous_sibling.node).code;

        if (code.includes('createElement("img");')) {
            return "embedded_image_img"
        }
    } catch {}
}

function check_for_tmx_tags_iframe(ideal_part) {
    try {  // tmx_tags_iframe_src
        if (
            ideal_part.parent.type === "BlockStatement" &&
            ideal_part.parentPath.parent.type === "CatchClause" &&
            ideal_part.parentPath.parentPath.parent.type === "TryStatement"
        ) {
            const code = generate(ideal_part.parentPath.parentPath.parentPath.node).code

            if (code.includes('contentWindow.document')) {
                return "tmx_tags_iframe_src"
            }
        }
    } catch {}
}

function check_for_fcjs(ideal_part) {
    // this url can be used for 2 things, mostly always for sending the profiling info however
    try {  // fcjs
        if (
            ideal_part.parent.type === "BlockStatement" &&
            ideal_part.parentPath.parent.type === "IfStatement" &&
            generate(ideal_part.parentPath.parent.test).code.includes("tmx_tags_iframe_marker")
        ) {
            return "profiling_url"
        }
    } catch {}
}

function check_for_p_tag(ideal_part) {
    const ideal_code = generate(ideal_part.node).code;

    if (ideal_code.includes('"url(" +')) {
        return "embedded_image_p"
    }
}

function profiling_tagging(ideal_part) {
    const checks = [
        check_for_embedded_image,
        check_for_tmx_tags_iframe,
        check_for_fcjs,
        check_for_p_tag
    ]

    for (const check of checks) {
        const result = check(ideal_part);

        if (result !== undefined) {
            return result;
        }
    }
}

module.exports = {
    profiling_tagging
}