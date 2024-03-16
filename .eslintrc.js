module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: 'tsconfig.json',
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules:{
        semi: ['error'],
        indent: ['error', 4, { SwitchCase: 1 }],
        quotes: ['error', 'single', { allowTemplateLiterals: false }],
        // 'quote-props': ['error', 'as-needed'],
        // 'keyword-spacing': ['error', { before: true, after: true }],
        // 'space-before-blocks': ['error', 'always'],
    },
    overrides: [
        {
            extends: ['plugin:@typescript-eslint/disable-type-checked'],
            files: ['./**/*.js'],
        },
    ],
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['test/**'], // todo: enable eslint for tests
    // "overrides":[
    //     {
    //         "files":[
    //             "**/*.test.ts",
    //             "test/**/*.ts"
    //         ],
    //         "rules":{
    //             "@typescript-eslint/explicit-function-return-type":[
    //                 "off"
    //             ]
    //         }
    //     }
    // ]
};
