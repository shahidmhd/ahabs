// import AWS from 'aws-sdk';

// AWS.config.update({
//     accessKeyId: 'AKIAR5FOBP3TTH2MPK4H',
//     secretAccessKey: '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',
//     region: 'ap-south-1',  // Use the correct region code
// });

// const s3 = new AWS.S3();

// export { AWS, s3 };


import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: 'AKIAQDXNLMKVRNFSO2UA',
    secretAccessKey: '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',
    region: 'ap-south-1',  // Use the correct region code
});

const s3 = new AWS.S3();

export { AWS, s3 };


