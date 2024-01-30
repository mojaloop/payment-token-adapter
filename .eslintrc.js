module.exports = {
    "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
    "project": [
        "./tsconfig.json"
    ],
        "sourceType": "module"
},
    "plugins": [
    "@typescript-eslint"
],
    "rules": {
    "semi": [
        "warn"
    ],
        "@typescript-eslint/no-inferrable-types": [
        "off"
    ]
},
    "ignorePatterns": [
    "**/*.d.ts",
    "**/*.js",
    "**/*.js.map"
],
    "overrides": [
    {
        "files": [
            "**/*.test.ts",
            "test/**/*.ts"
        ],
        "rules": {
            "@typescript-eslint/explicit-function-return-type": ["off"]
        }
    }
]
}