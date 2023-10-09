// import AWS from 'aws-sdk'

// AWS.config.update({
//     accessKeyId: 'AKIAR5FOBP3TTH2MPK4H',
//     secretAccessKey: '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',
//     region: 'US West (Oregon) us-west-2',
// });

// const s3 = new AWS.S3();
// awsConfig.js

import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: 'AKIAR5FOBP3TTH2MPK4H',
    secretAccessKey: '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',
    region: 'ap-south-1',  // Use the correct region code
});

const s3 = new AWS.S3();

export { AWS, s3 };

