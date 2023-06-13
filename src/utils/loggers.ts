import mongoose from 'mongoose';
import { ValidationErrors, CustomError } from '../contracts/errors';

export const handleValidationError = (error: CustomError): ValidationErrors => {
  const validationErrors: ValidationErrors = {};

  if (error instanceof mongoose.Error.ValidationError) {
    // Mongoose validation errors
    for (const key in error.errors) {
      if (error.errors.hasOwnProperty(key)) {
        validationErrors[key] = error.errors[key].message;
      }
    }
  } else if (error.name ===  'MongoServerError' && error.code === 11000) {
    // Unique constraint violation
    const duplicateKey : object = error.keyValue;
    const key = Object.keys(duplicateKey)[0];
    const value = Object.values(duplicateKey)[0];
    validationErrors[key] = `The ${key} : ${value} already registered.`;
  } 
  
  else {
    // Custom errors
    validationErrors['general_error'] = error.message;
  }

  return validationErrors;
};

