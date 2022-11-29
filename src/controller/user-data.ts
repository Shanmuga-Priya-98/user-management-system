import { Request,Response, NextFunction, json } from "express";
import axios, {AxiosResponse} from "axios";
import fs from 'fs'

const dbPath = './user-records.json'

interface UserData{
    id:Number,
    name:String,
    email:String,
    dob:String
}

const saveUserData = async (request: Request, response: Response, next: NextFunction) => {

    const payload = request.body
    const data:UserData[] = []
    if(Object.keys(payload).length===0){
        return response.status(400).json({
            message: 'payload is required'
        });
    }

    if(payload.email == null){
        return response.status(400).json({
            message: 'email is mandatory'
        });
    }

    console.log(payload)

    if(payload){
        data.push(payload)
    }

    saveData(payload)
   
    // return response
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
    return  JSON.parse(details.toString())
}

const saveData = (data: UserData)=>{
    fs.writeFileSync(dbPath, JSON.stringify(data))
}

export default {saveUserData,fetchUserDataById,deleteUserDataById};