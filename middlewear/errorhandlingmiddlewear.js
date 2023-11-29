import mongoose from 'mongoose'; 
const errorHandlingMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    if (err instanceof mongoose.Error.ValidationError) {
      // Mongoose validation error occurred
      const validationErrors = {};
  
      // Iterate over the validation errors and collect them
      for (const field in err.errors) {
        validationErrors[field] = err.errors[field].message;
      }
  
      return res.status(400).json({ status: 'fail', validationErrors });
    }
  
    if (err.statusCode === 404) {
      // Handle 404 errors
      return res.status(err.statusCode).json({ status: err.status, message: err.message });
    }
  
    // Handle other errors
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  };
  
  export default errorHandlingMiddleware;
  








