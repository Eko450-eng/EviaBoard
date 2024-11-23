import { PUBLIC_MINIO_AK, PUBLIC_MINIO_SK } from '$env/static/public';
import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
} from '@aws-sdk/client-s3';

const SK = PUBLIC_MINIO_SK || '';
const AK = PUBLIC_MINIO_AK || '';

export const minioClient = new S3Client({
	region: 'us-east-1',
	endpoint: 'https://minio.eko450eng.org',
	credentials: {
		accessKeyId: AK,
		secretAccessKey: SK,
	},
	forcePathStyle: true,
});

export const uploadToMinio = async (
	bucket: string,
	key: string,
	body: File,
) => {
	try {
		const command = new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: body,
		});
		const response = await minioClient.send(command);
		return response;
	} catch (err) {
		console.error('Error uploading file to MinIO:', err);
	}
};

export const getFromMinio = async (bucket: string, key: string) => {
	try {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		});
		const response = await minioClient.send(command);
		return response.Body;
	} catch (err) {
		console.error('Error retrieving file from MinIO:', err);
	}
};
