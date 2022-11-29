import { Request,Response, NextFunction, json } from "express";
import fs from 'fs'
import logger from "../../../libs/logger";
import badRequestError from "../../../libs/error-response";
const dbPath = './user-records.json'
import request from "supertest";
import router from "../../../src/router/user-data";
import userData from "../../../src/controller/user-data";

describe("save user data using post", () => {
	const payload = {
		name: "xyz",
        email:"xyz@gmail.com",
        dob:"12-11-1988"
	};

	test("storing the user details to json file", async () => {
		const mockSaveUserData = jest.fn((): any => payload);
		jest
			.spyOn(userData, "saveUserData")
			.mockImplementation(() => mockSaveUserData());

		const res = await request(router).post("/users").send(payload);

		expect(mockSaveUserData).toHaveBeenCalledTimes(1);
		expect(res.body).toHaveProperty("user data inserted successfully");
	});
});


describe("retrieve user data by id", () => {
	const id=1;
    const response = {
        id:1,
        name:"xyz",
        email:"xyz@yahoo.com",
        dob:"12-11-1988"
    }
	test("returns details of the user by id", async () => {
		const mockFetchUserById = jest.fn((): any => response);
		jest
			.spyOn(userData, "fetchUserDataById")
			.mockImplementation(() => mockFetchUserById());

		const res = await request(router).get("/users/"+id);
        
		expect(mockFetchUserById).toHaveBeenCalledTimes(1);
		expect(res.body).toEqual(response);
	});

})

describe("delete user data by id", () => {
	
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();
    beforeEach(() => {
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });
  
	// test("returns details of the user by id", async () => {
	// 	const mockDeleteUserById = jest.fn((): any => response);
	// 	jest
	// 		.spyOn(userData, "deleteUserDataById")
	// 		.mockImplementation(() => mockDeleteUserById());

	// 	const res = await request(router).delete("/users/"+id);
        
    //     console.log('-----------', res)

	// 	expect(mockDeleteUserById).toHaveBeenCalledTimes(1);
	// 	expect(res.body).toEqual(response);
	// });

    it("should verify token with a invalid token", () => {
        
        const id=1;
        const response = {
            message: 'user details deleted successfully'
    
        }

    userData.deleteUserDataById(mockRequest as Request, mockResponse as Response, nextFunction);
        expect(mockResponse.status).toBe(200);
    });

})
