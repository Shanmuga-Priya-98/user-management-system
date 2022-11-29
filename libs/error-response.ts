

export const badRequestError = (message: string) => {
    return {
        code:400,
        type:'Bad Request',
        message: message
    }
  };

export default badRequestError;