import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import Petwalk from "../models/petwalk.js";

dotenv.config();

export const initiateEsewaPayment = async (req, res) => {
  console.log("Initiating eSewa payment...");
  console.log("Request body:", req.body); // Debug log
  
  try {
    // Create booking and generate payment details
    const booking = await Petwalk.create(req.body);
    console.log("Booking created:", booking._id); // Debug log
    
    const amount = 700;
    const uuid = booking._id.toString();
    const productCode = process.env.ESEWA_PRODUCT_CODE;
    const secret = process.env.ESEWA_SECRET_KEY;
    const gateway = process.env.ESEWA_GATEWAY_URL;

    // Verify environment variables
    if (!productCode || !secret || !gateway) {
      console.error("Missing environment variables:", { productCode, secret, gateway });
      return res.status(500).json({ message: "Server configuration error" });
    }

    const signature = crypto
      .createHmac("sha256", secret)
      .update(`total_amount=${amount},transaction_uuid=${uuid},product_code=${productCode}`)
      .digest("base64");

    const payload = {
      amount,
      tax_amount: 0,
      product_service_charge: 0,
      product_delivery_charge: 0,
      total_amount: amount,
      transaction_uuid: uuid,
      product_code: productCode,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
      success_url: `${process.env.CLIENT_URL}/complete-payment`,
      failure_url: `${process.env.CLIENT_URL}/pet_walking_booking?success=false`,
    };

    console.log("Payment payload:", payload); // Debug log

    // Return JSON response with payment URL instead of HTML form
    const paymentUrl = `${gateway}/api/epay/main/v2/form`;
    
    res.json({
      success: true,
      paymentUrl: paymentUrl,
      payload: payload
    });

  } catch (err) {
    console.error("Esewa initiation error:", err);
    
    // Check if it's a database error
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Invalid booking data", 
        errors: err.errors 
      });
    }
    
    res.status(500).json({ 
      message: "Payment initiation failed",
      error: err.message 
    });
  }
};