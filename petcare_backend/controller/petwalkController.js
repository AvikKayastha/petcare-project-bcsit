import crypto from "crypto";
import dotenv from "dotenv";
import Petwalk from "../models/petwalk.js";

dotenv.config();

// Initiate eSewa Payment with dynamic price
export const initiateEsewaPayment = async (req, res) => {
  try {
    console.log("Initiating eSewa payment...");
    console.log("Request body:", req.body);

    // Destructure hours and price per hour
    const { hours } = req.body;
    const pricePerHour = 700; // or pull from DB or config
    const totalAmount = hours * pricePerHour;

    // Create booking in DB
    const booking = await Petwalk.create(req.body);
    const uuid = booking._id.toString();

    const productCode = process.env.ESEWA_PRODUCT_CODE;
    const secret = process.env.ESEWA_SECRET_KEY;
    const gateway = process.env.ESEWA_GATEWAY_URL;

    if (!productCode || !secret || !gateway) {
      return res.status(500).json({ message: "Missing eSewa config" });
    }

    const signature = crypto
      .createHmac("sha256", secret)
      .update(`total_amount=${totalAmount},transaction_uuid=${uuid},product_code=${productCode}`)
      .digest("base64");

    const payload = {
      amount: totalAmount,
      tax_amount: 0,
      product_service_charge: 0,
      product_delivery_charge: 0,
      total_amount: totalAmount,
      transaction_uuid: uuid,
      product_code: productCode,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
      success_url: `${process.env.CLIENT_URL}/complete-payment`,
      failure_url: `${process.env.CLIENT_URL}/pet_walking_booking?success=false`,
    };

    const paymentUrl = `${gateway}/api/epay/main/v2/form`;

    res.json({
      success: true,
      paymentUrl,
      payload
    });
  } catch (err) {
    console.error("Esewa initiation error:", err);
    res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      error: err.message
    });
  }
};

// Get Bookings for Logged-in User
export const getUserBookings = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Petwalk.find({ email: userEmail }).sort({ createdAt: -1 });

    const formatted = bookings.map(booking => ({
      service: "Pet Walking",
      date: booking.date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      status: "Confirmed",
      petName: booking.petName,
      hours: booking.hours
    }));

    res.json({ success: true, bookings: formatted });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};
