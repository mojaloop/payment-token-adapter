module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coveragePathIgnorePatterns:['dist'],
    coverageReporters: ['text', ['json', {file: 'integration-final.json'}]],
    coverageDirectory: './coverage/',
    clearMocks: true,
    // coverageThreshold: {
    //     "global": {
    //         "branches": 90,
    //         "functions": 90,
    //         "lines": 90,
    //         "statements": -10
    //     }
    // }
};
