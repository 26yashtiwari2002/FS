import express from 'express';
import fileModel from '../model/fileModel.js';
import dotenv from 'dotenv';
dotenv.config();
export const UploadController =async(req,res)=>{
    try{
        //functionality to upload file
        const backendurl=process.env.BACKEND_URL;
        const fileObject={
            path:req.file.path,
            name:req.file.originalname,
        }
        const file=await fileModel.create(fileObject);
        console.log(file);
        return res.status(200).json({ path:`${backendurl}/files/${file._id}` });

    }catch(error){
        return res.status(500).json({ message:error.message });
    }

};
export const downloadController=async(req,res)=>{
    try{
        const file=await fileModel.findById(req.params.fileId);
        if(!file) return res.status(404).json({ message:"File not found" });
        res.download(file.path,file.name);

    }catch(err){
        return res.status(500).json({ message: err.message });
    }
};