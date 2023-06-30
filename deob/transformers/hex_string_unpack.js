const hexStringVisitor = {
    StringLiteral(path) {
        if (path.node.extra) delete path.node.extra;
    }
}

module.exports = {
    hexStringVisitor
}