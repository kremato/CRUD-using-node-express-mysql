require('dotenv').config();
const { BlobServiceClient } = require('@azure/storage-blob')

const AZURE_STORAGE_CONNECTION_STRING = process.env.azure_storage_connection_string 

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient('profilepics');

const uploadImage = async (file) => {
    const blockBlobClient = containerClient.getBlockBlobClient(file.name);
    await blockBlobClient.uploadData(file.data, {
        blobHTTPHeaders: { blobContentType: file.mimetype }
    });
    return blockBlobClient.url;
}

const deleteImage = async (fileName) => {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const response = await blockBlobClient.deleteIfExists();
    return response.succeeded;
}

module.exports = {
    uploadImage,
    deleteImage
};