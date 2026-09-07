const rootUrl = `${location.protocol}//${location.host}`;

const envs = {

    // Local Dev
    'http://localhost:65094': {
        APP_ENV: 'Dev',
        API_SERVER: '',
        //Uncomment this line if you want to point towards Azure services instead of running it locally.
        API_SERVER: 'https://test.lis.virginia.gov',
        INSTRUMENTATION_KEY: '',
        HISTORICAL_DATA_REDIRECT: false,
        STORAGE_ACCOUNT_DOMAIN: 'https://lisdoc.blob.core.windows.net'
    },

    // Dev
    'https://dev.lis.virginia.gov': {
        APP_ENV: 'Dev',
        API_SERVER: 'https://dev.lis.virginia.gov',
        INSTRUMENTATION_KEY: '58ca33c6-9d59-41ab-abcf-6474739ee07b',
        HISTORICAL_DATA_REDIRECT: true,
        STORAGE_ACCOUNT_DOMAIN: 'https://lisdoc.blob.core.windows.net'
    },

    // Test
    'https://test.lis.virginia.gov': {
        APP_ENV: 'Test',
        API_SERVER: 'https://test.lis.virginia.gov',
        INSTRUMENTATION_KEY: '37ae3a6c-8215-42c4-aaeb-e683de227ee4',
        STORAGE_ACCOUNT_DOMAIN: 'https://lisdoc.blob.core.windows.net'
    },

    // QA
    'https://qa.lis.virginia.gov': {
        APP_ENV: 'QA',
        API_SERVER: 'https://qa.lis.virginia.gov',
        INSTRUMENTATION_KEY: 'df7a0319-ce88-47d1-9283-fdf1153bff55',
        HISTORICAL_DATA_REDIRECT: false,
        STORAGE_ACCOUNT_DOMAIN: 'https://lisdoc.blob.core.windows.net'
    },

    // Sandbox
    'https://sandbox.virginialegislation.com': {
        APP_ENV: 'Production',
        API_SERVER: 'https://sandbox.virginialegislation.com/',
        INSTRUMENTATION_KEY: '12ea46f8-0fe2-45cc-a1be-e1979682888d',
        HISTORICAL_DATA_REDIRECT: false,
    },

    // PrePROD
    'https://preprod.lis.virginia.gov': {
        APP_ENV: 'PreProd',
        API_SERVER: 'https://preprod.lis.virginia.gov',
        INSTRUMENTATION_KEY: '427a0acf-195e-40cf-9a8c-de75fa4a25e4',
        HISTORICAL_DATA_REDIRECT: true,
        STORAGE_ACCOUNT_DOMAIN: 'https://lispreprod.blob.core.windows.net'
    },

    // PROD
    'https://prod.lis.virginia.gov': {
        APP_ENV: 'Production',
        API_SERVER: 'https://prod.lis.virginia.gov',
        INSTRUMENTATION_KEY: '12ea46f8-0fe2-45cc-a1be-e1979682888d',
        HISTORICAL_DATA_REDIRECT: false,
        STORAGE_ACCOUNT_DOMAIN: 'https://lis.blob.core.windows.net'
    },

    // GL PROD
    'https://lis.virginia.gov': {
        APP_ENV: 'Production',
        API_SERVER: 'https://lis.virginia.gov',
        INSTRUMENTATION_KEY: '12ea46f8-0fe2-45cc-a1be-e1979682888d',
        HISTORICAL_DATA_REDIRECT: true,
        STORAGE_ACCOUNT_DOMAIN: 'https://lis.blob.core.windows.net'
    }

};

if (envs[rootUrl]) {
    // Set environment variables based on the URL the app is being accessed from
    window.env = envs[rootUrl];
} else {
    // Redirect to production if the rootUrl is unknown
    window.env = envs['http://localhost:65094'];
}
