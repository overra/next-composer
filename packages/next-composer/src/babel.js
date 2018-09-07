const isPage = state => {
  const filename = state.file.opts.sourceFileName;
  return filename.startsWith("pages/") && !filename.startsWith("pages/_");
};

module.exports = ({ types: t, template, transformFromAst }) => {
  return {
    visitor: {
      JSXElement(path, state) {
        if (!isPage(state)) return;

        const { name } = path.node.openingElement.name;
        const componentName = name.toLowerCase() === name ? `"${name}"` : name;
        const tempAst = template(
          `
            <ComposedComponent 
              __component={${componentName}} 
              __ast={${JSON.stringify({ ...path.node })}} 
            />
          `,
          { plugins: ["jsx"] }
        )();
        path.node.openingElement.name.name = "ComposedComponent";
        if (!path.node.openingElement.selfClosing) {
          path.node.closingElement.name.name = "ComposedComponent";
        }
        path.node.openingElement.attributes = [
          ...path.node.openingElement.attributes,
          ...tempAst.expression.openingElement.attributes
        ];
      },
      Program(path, state) {
        if (!isPage(state)) return;
        const composer = template(
          `import {withComposer, ComposedComponent} from "next-composer"`
        );
        // insert import at top of file
        path.unshiftContainer("body", composer());
      },
      ExportDefaultDeclaration(path, state) {
        const filename = state.file.opts.sourceFileName;
        if (filename.startsWith("pages/") && !filename.startsWith("pages/_")) {
          const builder = template(
            `withComposer(EXPORT, ${JSON.stringify(state.file.ast)}, \`${
              state.file.code
            }\`)`
          );

          /**
           * Refactor default export
           * - move exported class declarations and wrap class name
           * - wrap expressions, arrow funcs, etc
           */

          if (path.node.declaration.type === "ClassDeclaration") {
            path.insertBefore(path.node.declaration);
            path.node.declaration = builder({
              EXPORT: path.node.declaration.id
            });
          } else {
            path.node.declaration = builder({
              EXPORT: path.node.declaration
            });
          }
        }
      }
    }
  };
};
