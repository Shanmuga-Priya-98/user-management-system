

export const badRequestError = (message: string) => {
    return {
        code:400,
        type:'Bad Request',
        message: message
    }
  };

  export const successResponse = (message: string) => {
    return {
        code:200,
        type:'Success',
        message: message
    }
  };

  export const NotFoundError = (message: string) => {
    return {
        code:404,
        type:'Not Found',
        message: message
    }
  };

export default {badRequestError,NotFoundError,successResponse};