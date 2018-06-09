import serverDevEnv from './server_dev';
import localDevEnv from './local_dev';
import stagingEnv from './staging';
import prodEnv from './prod';

const environment = ((e) => {
    if (e === 'staging') {
        return stagingEnv;
    } else if (e === 'prod') {
        return prodEnv;
    } else if (e === 'dev') {
        return serverDevEnv;
    } else { // local
        return localDevEnv;
    }
})(__ENV__);

const config = {
    ...environment,
    env: __ENV__
};

export default config;
