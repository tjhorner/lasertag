var config = {
    dev: {
        mode: 'dev',
        port: 8080
    },
    staging: {
        mode: 'staging',
        port: 1337
    },
    production: {
        mode: 'production',
        port: 80
    }
};

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'dev'] || config.dev;
};