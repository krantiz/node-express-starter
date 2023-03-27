const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");

// Set the AWS region and credentials
const s3Client = new S3Client({
  region: "eu-west-2", // Replace with your preferred region
  credentials: {
    secretAccessKey: "/L45VbIlaVexXG5KX",
    accessKeyId: "",
  },
});

const uploadTheFile = async (req, res, video) => {
  // Upload the file to S3
  try {
    const fileName = `recorded-${new Date().toISOString()}.webm`;
    const putObjectCommand = new PutObjectCommand({
      Bucket: "piacademy-kranti",
      Key: fileName,
      Body: fs.createReadStream(video.path),
      // ACL: 'public-read',
      ContentType: "video/webm",
    });
    const result = await s3Client.send(putObjectCommand);
    fs.unlink(video.path, () => console.log("Deleted local file!"));
    // const response = await s3Client.getObject().promise();
    // const fileContent = response.Body.toString("utf-8"); // can also do 'base64' here if desired
    // console.log(fileContent);
    // return fileContent;

    const { Body, ContentType } = await s3Client.send(
      new GetObjectCommand({
        Bucket: "piacademy-kranti",
        Key: "recorded-2023-02-23T14:21:01.155Z.webm",
      })
    );
    console.log({ Body, ContentType });
    // res.writeHead(200, {
    //   'Content-Type': ContentType,
    //   'Content-Disposition': `attachment; filename=${req.params.key}`,
    // });
    return { data: Body.toString("base64") };
  } catch (err) {
    console.error(err, err.stack);
  }
};

const uploadTheFileToS3 = async (req, res, video) => {
  // Upload the file to S3
  try {
    const fileName = `recorded-${new Date().toISOString()}.webm`;
    const putObjectCommand = new PutObjectCommand({
      Bucket: "piacademy-kranti",
      Key: fileName,
      Body: fs.createReadStream(video.path),
      // ACL: 'public-read',
      ContentType: "video/webm",
    });
    const result = await s3Client.send(putObjectCommand);
    fs.unlink(video.path, () => console.log("Deleted local file!"));
    // const response = await s3Client.getObject().promise();
    // const fileContent = response.Body.toString("utf-8"); // can also do 'base64' here if desired
    // console.log(fileContent);
    // return fileContent;

    const { Body, ContentType } = await s3Client.send(
      new GetObjectCommand({
        Bucket: "piacademy-kranti",
        Key: "recorded-2023-02-23T14:21:01.155Z.webm",
      })
    );
    console.log({ Body, ContentType });
    // res.writeHead(200, {
    //   'Content-Type': ContentType,
    //   'Content-Disposition': `attachment; filename=${req.params.key}`,
    // });
    return { data: Body.toString("base64") };
  } catch (err) {
    console.error(err, err.stack);
  }
};

module.exports = { uploadTheFile };
