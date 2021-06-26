import Prism from "prism-react-renderer/prism";

(typeof global !== "undefined" ? global : window).Prism = Prism;

require("prismjs/themes/prism-okaidia.css")
require("prismjs/components/prism-csharp");
require("./src/css/style.css")
