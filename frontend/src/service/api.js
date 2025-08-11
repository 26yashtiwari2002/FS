import dotenv from 'dotenv';

dotenv.config();

export const uploadFile = async (fileData) => {
    try{
        const backend_url=process.env.VITE_BACKEND_URL;
        const response = await fetch(`${backend_url}/upload`, {
            method: 'POST',
            body: fileData
        });
        return response.json();


    }catch(error){
        console.log("error while uploading file",error.message);
    }
}
export default uploadFile;