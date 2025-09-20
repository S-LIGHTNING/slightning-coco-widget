const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const jscode = `
var g = 1;
g = 2;
function squire(i){
    i * g * i;
}
function i()
{
    var i = 123;
    i += 2;
    return 123;
}
`;
let ast = parser.parse(jscode);

traverse(ast, {
    ReturnStatement(path){
        console.log(path.scope.getBinding("g"))
    }
});