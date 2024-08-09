import { S3 } from "aws-sdk";
import { Request, Response } from "express";
import ReplIt from "./schema/db";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.S3_ENDPOINT,
});

export async function copyS3Folder(
  sourcePrefix: string,
  destinationPrefix: string,
  continuationToken?: string
): Promise<void> {
  try {
    const listParams = {
      Bucket: process.env.S3_BUCKET ?? "",
      Prefix: sourcePrefix,
      ContinuationToken: continuationToken,
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

    await Promise.all(
      listedObjects.Contents.map(async (object) => {
        if (!object.Key) return;
        let destinationKey = object.Key.replace(
          sourcePrefix,
          destinationPrefix
        );
        let copyParams = {
          Bucket: process.env.S3_BUCKET ?? "",
          CopySource: `${process.env.S3_BUCKET}/${object.Key}`,
          Key: destinationKey,
        };

        await s3.copyObject(copyParams).promise();
        console.log(`Copied ${object.Key} to ${destinationKey}`);
      })
    );
    
    if (listedObjects.IsTruncated) {
      listParams.ContinuationToken = listedObjects.NextContinuationToken;
      await copyS3Folder(sourcePrefix, destinationPrefix, continuationToken);
    }
  } catch (error) {
    console.error("Error copying folder:", error);
  }
}

export const saveToS3 = async (
  key: string,
  filePath: string,
  content: string
): Promise<void> => {
  const params = {
    Bucket: process.env.S3_BUCKET ?? "",
    Key: `${key}${filePath}`,
    Body: content,
  };

  await s3.putObject(params).promise();
};

export const replIdExist = async (replId: string) => {
  try {
    const folderStructure = `code/${replId}/`;

    const params = {
      Bucket: process.env.S3_BUCKET ?? "",
      Prefix: folderStructure,
      Delimiter: "/",
    };

    const listedObjects = await s3.listObjectsV2(params).promise();
    if (!listedObjects.Contents) throw new Error("Contents key not present");

    return listedObjects.Contents.length > 0;
  } catch (error) {
    console.log(error);
  }
};

export const getAvailableReplit = async (_req: Request, res: Response) => {
  try {
    const folderStructure = `code/`;

    const params = {
      Bucket: process.env.S3_BUCKET ?? "",
      Prefix: folderStructure,
      Delimiter: "/",
    };

    const { CommonPrefixes } = await s3.listObjectsV2(params).promise();

    res.json({ availabelReplit: CommonPrefixes });
  } catch (error) {
    console.log(error);
  }
};

// export const getReplLanguage = async (req: Request, res: Response) => {
//   try {
//     const replId = req.params.replId;

//     const replData = await ReplIt.findOne({ replId });

//     const language = replData?.language;
//     res.json({ language });
//   } catch (err) {
//     console.log(err);
//   }
// };
