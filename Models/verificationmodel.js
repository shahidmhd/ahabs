import mongoose from "mongoose";

// Define a schema for verification records
const verificationRecordSchema = new mongoose.Schema({
  email: { type: String, required: true }, // User's email
  code: { type: String, required: true },  // Verification code
  expiresAt: { type: Date, required: true }, // Expiration timestamp
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});

// Create a model from the schema
const VerificationRecord = mongoose.model('VerificationRecord', verificationRecordSchema);

export default VerificationRecord
