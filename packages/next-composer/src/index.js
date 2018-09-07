import React from "react";

const getHierarchy = nodes => {
  return nodes.map((node, i) => ({
    name: node.openingElement.name.name,
    nodes: getHierarchy(node.children.filter(node => t.isJSXElement(node)))
  }));
};

export const withComposer = (m, ast, code) => {
  if (process.browser) {
    console.log(code, ast);
  }
  return m;
};

export const ComposedComponent = ({ __component, __ast, ...props }) => {
  console.log(__component, __ast);
  return (
    <>
      <__component {...props} />
      <strong>Page AST</strong>
      <pre>{JSON.stringify(__ast, null, 2)}</pre>
    </>
  );
};
