import axios from "axios";



const server_api = import.meta.env.VITE_SERVER_API;

// FETCH DATA
export const fetchData =async(url)=>{
    try{
        const {data}=await axios.get(server_api+url);
        return data;
    }
    catch(err){
        console.log(err);
        return err;
    }
}

// POST DATA
export const postData= async(url,formData)=>{
    const {res}= await axios.post(server_api+url,formData);
    return res;
}

//UPDATE OR EDIT DATA
export const putData=async(url,updateedData)=>{
    const {res}=await axios.put(server_api+url,updateedData);
    return res;
}

//DELETE  DATA
export const deleteData=async(url)=>{
    try{
        const {res}=await axios.delete(server_api+url);
        return res;
    }
    catch(err){
        return err;
        
    }
}

//GET by User Data
export const getUser=async(url,formData)=>{
    try{
        const {res}= await axios.get(server_api+url,formData);
        return res;
    }
    catch(err){
        console.log(err);
        return err;
        
    }
}

//GET by User Data
export const userData = async (url, formData) => {
    try {
        const response = await axios.post(server_api+url, formData);
        return response.data;
    } catch (error) {
        console.error('Error in postData:', error.response?.data || error.message);
        throw error.response?.data || new Error('An error occurred');
    }
};

export const CartData = async (url, formData) => {
    try {
        const response = await axios.post(server_api+url, formData);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else {
            return { status: 500, data: { message: 'Unexpected Error' } };
        }
    }
};
