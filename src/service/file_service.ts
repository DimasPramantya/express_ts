import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "../util/cloudinary_uploader";
import { EntityNotFoundException, InternalServerErrorException } from "../util/global_exception";
import { Request, Response, NextFunction } from "express";
import prisma from "../util/prisma";

interface CloudinaryFile extends Express.Multer.File {
    buffer: Buffer;
}

async function uploadImageCloudinaryHandler(file: CloudinaryFile): Promise<UploadApiResponse | UploadApiErrorResponse>{
    try {
        const base64String = file.buffer.toString('base64');
        const dataUri = `data:${file.mimetype};base64,${base64String}`;
        return await cloudinary.uploader.upload(dataUri, {
            folder: 'blog',
            public_id: `${Date.now()}`,
        });
    } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Error uploading image');
    }
};

async function uploadImage(req: Request, res: Response, next: NextFunction){
    try {
        const file = req.file as CloudinaryFile;
        console.log(file)
        const result = await uploadImageCloudinaryHandler(file);
        const file_db = await prisma.file.create({
            data: {
                originalFilename: file.originalname,
                secureUrl: result.secure_url,
                bytes: result.bytes,
                format: result.format,
                resourceType: result.resource_type,
                cloudinaryId: result.public_id,
            }
        })
        res.status(200).json({message: "Image uploaded successfully", file: file_db});
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function getImageById(req: Request, res: Response, next: NextFunction){
    try {
        const { id } = req.params;
        const file = await prisma.file.findUnique({
            where: {
                id
            }
        });
        if(!file){
            throw new EntityNotFoundException(`File with id - ${id} not found`);
        }
        res.status(200).json({message:"Success",file});
    } catch (error) {
        next(error);
    }
}

export default {
    uploadImage, getImageById
}

