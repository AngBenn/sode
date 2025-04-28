// jest.config.js
module.exports = {
    transformIgnorePatterns: [
      '/node_modules/(?!axios)/' // Process axios with Babel
    ],
  };