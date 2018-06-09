const env = {
    NODE_ENV: process.env.NODE_ENV || 'local_dev',
    PORT: process.env.PORT || 8010,
    SSL_PORT: process.env.SSL_PORT || 8011,
    SSL_CERT: process.env.SSL_CERT || 'certs/cert.pem',
    SSL_KEY: process.env.SSL_KEY || 'certs/key.pem'
};

module.exports = env;
