module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
        jest: true, // Add this line to configure ESLint for Jest
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 13,
    },
    rules: {},
};