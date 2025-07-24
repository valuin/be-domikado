import fs from "fs";
import path from "path";
function appendJsExtension(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      appendJsExtension(filePath); // Recursively process directories
    } else if (file.endsWith(".js")) {
      let content = fs.readFileSync(filePath, "utf8");

      // Regular expression to match import paths, but exclude ones that already have a .js or other extensions
      content = content.replace(
        /(import\s.*?['"])(\..*?)(?<!\.js)(['"])/g,
        "$1$2.js$3"
      );

      fs.writeFileSync(filePath, content, "utf8");
    }
  });
}
// Process the 'dist' directory (or your compiled output directory)
appendJsExtension("./dist");
