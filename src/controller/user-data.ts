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

    fs.writeFileSync(dbPath, JSON.stringify(data))
   
    // return response
    return response.status(200).json({
        message: 'user data inserted successfully'
    });
};

const fetchUserDataById =async (request: Request, response: Response, next: NextFunction) => {
    const id: Number = parseInt(request.params.id);
    const getUserDetails = getUserData()
   
    const findUserById = getUserDetails.find((user: UserData)=>{
        return user.name==="aaaa"
    })

    console.log(findUserById)
    return response.send(findUserById)
}


const getUserData = ()=>{
    const details = fs.readFileSync(dbPath)
    return  JSON.parse(details.toString())
}

export default {saveUserData,fetchUserDataById};