import axios from "axios";

const URL = "https://electrocord.onrender.com/api/v1/";

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

const postAPI = async (endpoint : string, postData : any) =>
{
	try
	{
		const response = await axios.post(`${URL}${endpoint}`, postData, 
		{
			headers: 
			{
				'Content-Type': 'application/json'
			},
			withCredentials: true,
		});
		const { statusCode, data, message } = response.data;

		if(statusCode === 200 || statusCode === 201)//why the inconsistency bibek? Maybe I should just use success === true
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

export { getAPI, postAPI };
