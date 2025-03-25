// config-overrides.js
module.exports = function override(config, env) {
    const oneOfRule = config.module.rules.find(rule => Array.isArray(rule.oneOf));
  
    if (oneOfRule) {
      oneOfRule.oneOf.unshift({
        test: /\.md$/,
        use: 'raw-loader',
      });
    }
  
    return config;
  };
  