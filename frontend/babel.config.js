module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      "@babel/preset-typescript",
    ],
    plugins: [
      ["@babel/plugin-transform-class-properties", { loose: true }],
      ["@babel/plugin-transform-private-methods", { loose: true }],
      ["@babel/plugin-transform-private-property-in-object", { loose: true }],
    ],
    env: {
      test: {
        presets: [["@babel/preset-env", { targets: { node: "current" } }]],
        plugins: [
          ["@babel/plugin-transform-class-properties", { loose: true }],
          ["@babel/plugin-transform-private-methods", { loose: true }],
          ["@babel/plugin-transform-private-property-in-object", { loose: true }],
        ],
      },
    },
  };
};
