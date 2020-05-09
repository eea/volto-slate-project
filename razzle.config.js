/**
 * Replace with custom razzle config when needed.
 * @module razzle.config
 */

const jsConfig = require('./jsconfig').compilerOptions;

const pathsConfig = jsConfig.paths;
let voltoPath = './node_modules/@plone/volto';
Object.keys(pathsConfig).forEach(pkg => {
  if (pkg === '@plone/volto') {
    voltoPath = `./${jsConfig.baseUrl}/${pathsConfig[pkg][0]}`;
  }
});

const config = require(`${voltoPath}/razzle.config`);
const razzleModify = config.modify;

module.exports = {
  plugins: config.plugins,
  modify: (config, { target, dev }, webpack) => {
    const vc = razzleModify(config, { target, dev }, webpack);
    const jsxRule = vc.module.rules.find(
        module => module.test && module.test.toString() == /\.(js|jsx|mjs)$/, // eslint-disable-line
    );
    const jsxIndex = vc.module.rules.indexOf(jsxRule);
    jsxRule.exclude = [/src\/addons\/.+\/node_modules/];
    vc.module.rules[jsxIndex] = jsxRule;
    return vc;
  },
};
