import axiosInstance from "@/shared/lib/api";
import {ApiResponse} from "@/entities/message/types";

export const sendMessage = async (message: string): Promise<ApiResponse> => {
    try{
        const response =  await axiosInstance.post("chat", {
            message: message,
        });

        return response.data;
    }catch(e){
        console.error(e);
        throw e;
    }
}
