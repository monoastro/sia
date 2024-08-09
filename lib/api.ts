import axios from "axios";
import { apiBaseUrl, apiBaseUrlLocal } from "./data";

const URL = `${apiBaseUrl}/api/v1/`;

const getAPI = async (endpoint : string) =>
{
	//no cookie received by this
    try
	{
        const response = await axios.get(`${URL}${endpoint}`, 
		{
			withCredentials: true,
			//let's see if this works
			headers: 
			{
				'Content-Type': 'application/json'
			}
		});
		const { statusCode, data, message } = response.data;
		if(statusCode === 200 || statusCode === 201)
		{
			return data;
		}
		else
		{
			throw new Error(`Failed to get from ${endpoint} with status code ${statusCode} and message:\n\t\t${message}`);
		}
    }
	catch(error)
	{
        throw error;
    }
}

const postAPI = async (endpoint : string, postData : any, headers: any = { "Content-Type": "application/json" }) =>
{
	
	try
	{
		const response = await axios.post(`${URL}${endpoint}`, postData, 
		{
			headers: headers ,
			withCredentials: true,
		});
		const { statusCode, data, message } = response.data;

		if(statusCode === 200)
		{
			return data;
		}
		else
		{
			throw new Error(`Failed to post to ${endpoint} with status code ${statusCode} and message:\n\t\t${message}`);
		}
	}
	catch(error)
	{
		throw error;
	}
}

const putAPI = async (endpoint: string, putData: any, headers: any = {"Content-Type": "application/json"}) =>
{
    try
	{
        const response = await axios.put(`${URL}${endpoint}`, putData,
		{
			headers: headers,
            withCredentials: true
        });
        const { statusCode, data, message } = response.data;

        if (statusCode === 200) {
            return data;
        }
		else
		{
            throw new Error(`Failed to put to ${endpoint} with status code ${statusCode} and message:\n\t\t${message}`);
        }
    }
	catch (error)
	{
        throw error;
    }
};


const deleteAPI = async (endpoint : string) =>
{
	try
	{
		const response = await axios.delete(`${URL}${endpoint}`, 
		{
			withCredentials: true
		});
		const { statusCode, data, message } = response.data;

		if(statusCode === 200)
		{
			return data;
		}
		else
		{
			throw new Error(`Failed to delete from ${endpoint} with status code ${statusCode} and message:\n\t\t${message}`);
		}
	}
	catch(error)
	{
		throw error;
	}
}

export { getAPI, postAPI, putAPI, deleteAPI };
