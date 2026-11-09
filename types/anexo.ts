export interface Attachment {
  id: string;
  studentID: string;
  fileName: string;
  s3Key: string;
  s3Bucket: string;
  url: string;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string;
  localUpdatedAt: string;
}
