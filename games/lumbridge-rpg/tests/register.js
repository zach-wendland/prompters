const { readFileSync } = require('node:fs');
const ts = require('typescript');

const compile = (module, filename) => {
  const source = readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
      moduleResolution: ts.ModuleResolutionKind.Node10,
      allowJs: false,
    },
    fileName: filename,
  });

  return module._compile(outputText, filename);
};

require.extensions['.ts'] = compile;
require.extensions['.tsx'] = compile;
