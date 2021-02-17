import AWS from "aws-sdk";
import { S3Service } from "../../src/services/s3Service";

process.env.EXPORT_BUCKET = "TBD";

describe("S3Service", () => {

    const sut = new S3Service(new AWS.S3());

    it("putExport should save file with KMS", async () => {

        await sut.put(process.env.EXPORT_BUCKET, "test.json", JSON.stringify({hello: "world"}));
    });
});