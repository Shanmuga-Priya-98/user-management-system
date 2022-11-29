import { Request,Response, NextFunction, json } from "express";
import fs from 'fs'
import logger from "../../libs/logger";
import badRequestError from "../../libs/error-response";
const dbPath = './user-records.json'
import UserData from "../model/user-data";


const saveUserData = async (request: Request, response: Response, next: NextFunction) => {


    const payload = request.body
    logger.info({message:"Invoking Post API to Save Data", payload});
    
    if(Object.keys(payload).length===0){
        logger.error({message:"request body is not passed"})
        return response.status(400).send(badRequestError('payload is required'))
        
    }

    if(payload.email == null){
        return response.status(400).send(badRequestError('email is mandatory'));
    }

    const details = getUserData();
    if(details.length===0){
        request.body.id = 1
    }else{
        const lastRecord = details[details.length-1];
        request.body.id = lastRecord.id+1
    }

    const checkIfDataExists = details.find((user:UserData)=>{
        return user.email === payload.email
    })

    if(checkIfDataExists){
        return response.status(400).send(badRequestError('email already exists')); 
    }else{
        details.push(payload)
    }

    saveData(details)
   
    return response.status(200).json({
        message: 'user data inserted successfully'
    });
};

const fetchUserDataById =async (request: Request, response: Response, next: NextFunction) => {
    const id: Number = parseInt(request.params.id);
    const getUserDetails = getUserData()
   
    const findUserById = getUserDetails.find((user: UserData)=>{
        return user.id===id
    })

    if(!findUserById){
        return response.status(404).json({
            message: 'id is not found'
        });
    }

    return response.send(findUserById)
}

const deleteUserDataById =async (request: Request, response: Response, next: NextFunction) => {
    const id: Number = parseInt(request.params.id);
    const getUserDetails = getUserData()
   
    const filteredUsers = getUserDetails.filter((user: UserData)=>{
        return user.id!==id
    })

    if(!filteredUsers){
        return response.status(404).json({
            message: 'id is not found'
        });
    }
    
    saveData(filteredUsers)

    return response.status(200).json({
        message: 'user details deleted successfully'
    })
}


const getUserData = ()=>{
    const details = fs.readFileSync(dbPath) 
    const user: UserData[]=[]
    if(details.toJSON().data.length === 0){
        return user
       
    }else{
        return  JSON.parse(details.toString())
    }
    
}

const saveData = (data: UserData)=>{
    fs.writeFileSync(dbPath, JSON.stringify(data))
}

export default {saveUserData,fetchUserDataById,deleteUserDataById};