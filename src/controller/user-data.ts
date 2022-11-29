import { Request,Response, NextFunction, json } from "express";
import fs from 'fs'
import logger from "../../libs/logger";
import {badRequestError,NotFoundError,successResponse} from "../../libs/error-response";
const dbPath = './user-records.json'
import UserData from "../model/user-data";


const saveUserData =  (request: Request, response: Response, next: NextFunction) => {


    const payload = request.body
    logger.info({message:"Invoking Post API to Save Data", payload});
    
    if(Object.keys(payload).length===0){
        logger.error({message:"request body is not passed"})
        return response.status(400).send(badRequestError('payload is required'))
        
    }

    if(payload.email == null || payload.name == null || payload.dob == null){
        logger.error({message:"email,name,dob is mandatory"})
        return response.status(400).send(badRequestError('email,name,dob is mandatory'));
    }    

    const details = getUserData();

    logger.info({message:'get user details', details})
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
        logger.error({message: 'email already exists'})
        return response.status(400).send(badRequestError('email already exists')); 
    }else{
        details.push(payload)
    }

    logger.info({message:'saving data to json file'})
    saveData(details)
   
    return response.status(200).send(
        successResponse('user data inserted successfully'));
};

const fetchUserDataById = (request: Request, response: Response, next: NextFunction) => {

    
    const id: Number = parseInt(request.params.id);
    logger.info({message: 'Invoking Get API to fetchUserDataById', pathParam: id})
    const getUserDetails = getUserData()
    logger.info({message: 'fetching the existing records', getUserDetails})
    const findUserById = getUserDetails.find((user: UserData)=>{
        return user.id===id
    })


    if(!findUserById){
        logger.error({message: 'id is not found'})
        return response.status(404).send(NotFoundError('id is not found'
        ));
    }

    logger.info({message:'find user by id', findUserById})

    return response.send(findUserById)
}

const deleteUserDataById = (request: Request, response: Response, next: NextFunction) => {
    const id: Number = parseInt(request.params.id);
    logger.info({message: 'Invoking Delete API to deleteUserDataById', pathParam: id})
    const getUserDetails = getUserData()
    logger.info({message: 'fetching the existing records', getUserDetails})
    const filteredUsers = getUserDetails.filter((user: UserData)=>{
        return user.id!==id
    })
    logger.info({message: 'filtered users',filteredUsers})
    if(!filteredUsers){
        return response.status(404).send(NotFoundError('id is not found'
        ));
    }
    logger.info({message: 'saving data after the data removal'})
    saveData(filteredUsers)

    return response.status(200).send(successResponse('user details deleted successfully'))
       

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
    if (fs.existsSync(dbPath)) {
       logger.info({message: 'file exists'})
       fs.writeFileSync(dbPath, JSON.stringify(data))
      }else{
        logger.info({message: 'file does not exists'})
        return badRequestError('file does not exists')
      }
    
}

export default {saveUserData,fetchUserDataById,deleteUserDataById};