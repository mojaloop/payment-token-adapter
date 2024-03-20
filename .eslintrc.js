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
        'quote-props': ['error', 'as-needed'],
        'no-console': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
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
    ignorePatterns: ['test/func/**', 'test/mocks/**'], // todo: enable eslint for tests
};
