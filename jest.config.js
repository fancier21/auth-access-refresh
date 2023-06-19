module.exports = {
    transform: {
        '^.+\\.ts?$': '@swc/jest',
    },
    extensionsToTreatAsEsm: ['.ts', '.json'],
}
