// import mongoose from "mongoose";
// import Order from "../models/orders.model.js";
// import User from "../models/user.model.js";
// import Product from "../models/product.model.js";
// import { sendEmail } from "../services/emailService.js"; // Assume this path is correct

// // Define the orderConfirmedHtmlContent function directly in this file
// const orderConfirmedHtmlContent = (
//   orderNumber,
//   userName,
//   products,
//   subtotal,
//   shippingCost,
//   totalAmount,
//   shippingAddress
// ) => {
//   // Format shipping address
//   const { fullName, streetAddress, hostelRoom, cityStatePincode, phoneNumber } =
//     shippingAddress;
//   const formattedAddress = `
//     ${fullName}<br/>
//     ${streetAddress}<br/>
//     ${cityStatePincode}<br/>
//     ${phoneNumber}
//     `;

//   // ${hostelRoom ? `${hostelRoom}<br/>` : ""}
//   // Generate product rows for the table
//   const productRows = products
//     .map(
//       (item) => `
//     <tr>
//       <td style="padding: 8px; border-bottom: 1px solid #eee;">${
//         item.productName
//       }</td>
//       <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${
//         item.quantity
//       }</td>
//       <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(
//         2
//       )}</td>
//     </tr>
//   `
//     )
//     .join("");

//   return `
//     <div style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
//       <h2 style="color: #e89846; text-align: center; margin-bottom: 20px;">Your Rift Order (#${orderNumber}) is Confirmed!</h2>

//       <p>Hi ${userName},</p>
//       <p>Thank you for your order. We've received it and are getting everything ready.</p>
//       <p>We appreciate you being a part of the Rift community.</p>
//       <p>Below you'll find a summary of your purchase:</p>

//       <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//         <thead>
//           <tr>
//             <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: left;">Product</th>
//             <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">Quantity</th>
//             <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${productRows}
//         </tbody>
//       </table>

//       <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//         <tr>
//           <td style="padding: 5px 8px; text-align: right; font-weight: bold;">Subtotal:</td>
//           <td style="padding: 5px 8px; text-align: right;">₹${subtotal.toFixed(
//             2
//           )}</td>
//         </tr>
//         <tr>
//           <td style="padding: 5px 8px; text-align: right; font-weight: bold;">Shipping:</td>
//           <td style="padding: 5px 8px; text-align: right;">₹${shippingCost.toFixed(
//             2
//           )}</td>
//         </tr>
//         <!-- Add discount line if applicable -->
//         <!-- <tr>
//           <td style="padding: 5px 8px; text-align: right; font-weight: bold;">Discount:</td>
//           <td style="padding: 5px 8px; text-align: right;">-₹[Discount Amount]</td>
//         </tr> -->
//         <tr>
//           <td style="padding: 10px 8px; text-align: right; font-weight: bold; font-size: 1.2em; border-top: 1px solid #ddd;">Total (INR):</td>
//           <td style="padding: 10px 8px; text-align: right; font-weight: bold; font-size: 1.2em; border-top: 1px solid #ddd;">₹${totalAmount.toFixed(
//             2
//           )}</td>
//         </tr>
//       </table>

//       <p style="font-weight: bold;">Shipping Address:</p>
//       <p style="margin-bottom: 20px;">
//         ${formattedAddress}
//       </p>

//       <p>We're currently preparing your order. As we operate on a batch system to ensure the best quality, we will process all orders together.</p>
//       <p>You will receive another email notification as soon as your order is shipped to our campus location and is ready for distribution.</p>
//       <p>If you have any questions, concerns, or notice any issues with your order details, please reply directly to this email or contact us at <a href="mailto:riftwear.help@gmail.com" style="color: #e89846; text-decoration: none; font-weight: bold;">riftwear.help@gmail.com</a>.</p>
//       <p>Thanks again for your support.</p>
//       <p style="font-weight: bold;">Team Rift</p>

//       <p style="text-align: center; margin-top: 30px; font-size: 0.9em; color: #777;">
//         Find us on: <a href="[YOUR_INSTAGRAM_LINK]" style="color: #e89846; text-decoration: none;">[Instagram Icon/Link]</a>
//       </p>
//     </div>
//   `;
// };

// // This function handles the final order creation after a successful payment
// export const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       razorpayPaymentId,
//       razorpayOrderId,
//       totalAmount,
//     } = req.body;

//     // 1. Create the new order
//     const newOrder = new Order({
//       orderNumber: razorpayOrderId,
//       detailsOfCustomer: userId,
//       detailsOfProduct: cartItems.map((item) => ({
//         productId: item.productId._id,
//         size: item.size,
//         color: item.color,
//         variety: item.variety,
//         quantity: item.quantity,
//       })),
//       amount: totalAmount,
//       razorpayId: razorpayPaymentId,
//     });

//     const savedOrder = await newOrder.save();
//     console.log("razorpay order saved: from createOrder function", savedOrder);

//     // 2. Clear the user's cart
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { cartItem: [] },
//       { new: true }
//     ).populate("address"); // Populate address for email

//     // 3. Add the order ID to the user's order history
//     await User.findByIdAndUpdate(userId, { $push: { order: savedOrder._id } });

//     // 4. Send Order Confirmation Email
//     if (user) {
//       const orderNumber = savedOrder.orderNumber;
//       const userName = user.name;
//       const userEmail = user.email;

//       // Prepare product details for the email template
//       const productsForEmail = await Promise.all(
//         cartItems.map(async (item) => {
//           const productDetails = await Product.findById(item.productId._id);
//           return {
//             productName: productDetails
//               ? productDetails.name
//               : "Unknown Product",
//             quantity: item.quantity,
//             price: item.productId.price, // Use the price from the product itself
//           };
//         })
//       );

//       // Prepare shipping address details
//       const shippingAddress = {
//         fullName: user.name,
//         streetAddress: user.address?.street || "N/A",
//         hostelRoom: "N/A", // Assuming hostel/room isn't directly in your User model's address, adjust if it is
//         cityStatePincode: `${user.address?.city || "N/A"}, ${
//           user.address?.state || "N/A"
//         } - ${user.address?.postalCode || "N/A"}`,
//         phoneNumber: user.phoneNumber || "N/A",
//       };

//       const subtotal = productsForEmail.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       );
//       const shippingCost = 0; // Adjust this based on your actual shipping logic
//       const finalTotalAmount = totalAmount; // Use the totalAmount passed from frontend/payment gateway

//       const subject = `Your Rift Order (#${orderNumber}) is Confirmed!`;
//       const htmlContent = orderConfirmedHtmlContent(
//         orderNumber,
//         userName,
//         productsForEmail,
//         subtotal,
//         shippingCost,
//         finalTotalAmount,
//         shippingAddress
//       );

//       try {
//         await sendEmail(userEmail, subject, htmlContent);
//         console.log(
//           `Order confirmation email sent to ${userEmail} for order #${orderNumber}`
//         );
//       } catch (emailError) {
//         console.error("Failed to send order confirmation email:", emailError);
//         // Log the error but don't prevent the order creation from succeeding
//       }
//     } else {
//       console.warn(
//         `User with ID ${userId} not found after order creation, skipping email.`
//       );
//     }

//     console.log("order created successfully:", savedOrder);

//     res
//       .status(201)
//       .json({ message: "Order created successfully", order: savedOrder });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     // You might want to send an order failure email here if the order creation itself fails
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // This function fetches an order by its ID to display on the confirmation page
// export const getOrderById = async (req, res) => {
//   try {
//     const { id } = req.query; // Use query parameter to get the order ID
//     console.log(id);

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid order ID format" });
//     }

//     const order = await Order.findById(id)
//       .populate("detailsOfCustomer", "name email phoneNumber address") // Populate address
//       .populate("detailsOfProduct.productId", "name images price");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json({ order });
//   } catch (error) {
//     console.error("Error fetching order by ID:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
import mongoose from "mongoose";
import Order from "../models/orders.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { sendEmail } from "../services/emailService.js";

// Define the orderConfirmedHtmlContent function with updated product info
const orderConfirmedHtmlContent = (
  orderNumber,
  userName,
  products,
  subtotal,
  shippingCost,
  totalAmount,
  shippingAddress
) => {
  const { fullName, streetAddress, hostelRoom, cityStatePincode, phoneNumber } =
    shippingAddress;
  const formattedAddress = `
    ${fullName}<br/>
    ${streetAddress}<br/>
    ${cityStatePincode}<br/>
    ${phoneNumber}
    `;

  const productRows = products
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center;">
          <img src="${item.colorImage}" alt="${item.productName} - ${
        item.colorName
      }" style="width: 50px; height: 50px; margin-right: 10px; object-fit: cover; border-radius: 4px;">
          <span>${item.productName}</span>
        </div>
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(
        2
      )}</td>
    </tr>
  `
    )
    .join("");

  return `
    <div style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #e89846; text-align: center; margin-bottom: 20px;">Your Rift Order (#${orderNumber}) is Confirmed!</h2>
      
      <p>Hi ${userName},</p>
      <p>Thank you for your order. We've received it and are getting everything ready.</p>
      <p>We appreciate you being a part of the Rift community.</p>
      <p>Below you'll find a summary of your purchase:</p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: left;">Product</th>
            <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">Quantity</th>
            <th style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
      </table>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 5px 8px; text-align: right; font-weight: bold;">Subtotal:</td>
          <td style="padding: 5px 8px; text-align: right;">₹${subtotal.toFixed(
            2
          )}</td>
        </tr>
        <tr>
          <td style="padding: 5px 8px; text-align: right; font-weight: bold;">Shipping:</td>
          <td style="padding: 5px 8px; text-align: right;">₹${shippingCost.toFixed(
            2
          )}</td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; text-align: right; font-weight: bold; font-size: 1.2em; border-top: 1px solid #ddd;">Total (INR):</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: bold; font-size: 1.2em; border-top: 1px solid #ddd;">₹${totalAmount.toFixed(
            2
          )}</td>
        </tr>
      </table>

      <p style="font-weight: bold;">Shipping Address:</p>
      <p style="margin-bottom: 20px;">
        ${formattedAddress}
      </p>

      <p>We're currently preparing your order. As we operate on a batch system to ensure the best quality, we will process all orders together.</p>
      <p>You will receive another email notification as soon as your order is shipped to our campus location and is ready for distribution.</p>
      <p>If you have any questions, concerns, or notice any issues with your order details, please reply directly to this email or contact us at <a href="mailto:riftwear.help@gmail.com" style="color: #e89846; text-decoration: none; font-weight: bold;">riftwear.help@gmail.com</a>.</p>
      <p>Thanks again for your support.</p>
      <p style="font-weight: bold;">Team Rift</p>

      <p style="text-align: center; margin-top: 30px; font-size: 0.9em; color: #777;">
        Find us on: <a href="[YOUR_INSTAGRAM_LINK]" style="color: #e89846; text-decoration: none;">[Instagram Icon/Link]</a>
      </p>
    </div>
  `;
};

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      razorpayPaymentId,
      razorpayOrderId,
      totalAmount,
    } = req.body;

    const newOrder = new Order({
      orderNumber: razorpayOrderId,
      detailsOfCustomer: userId,
      detailsOfProduct: cartItems.map((item) => ({
        productId: item.productId._id,
        size: item.size,
        color: item.color, // The entire color object is now passed to the schema
        variety: item.variety,
        quantity: item.quantity,
      })),
      amount: totalAmount,
      razorpayId: razorpayPaymentId,
    });

    const savedOrder = await newOrder.save();
    console.log("razorpay order saved: from createOrder function", savedOrder);

    const user = await User.findByIdAndUpdate(
      userId,
      { cartItem: [] },
      { new: true }
    ).populate("address");

    await User.findByIdAndUpdate(userId, { $push: { order: savedOrder._id } });

    if (user) {
      const orderNumber = savedOrder.orderNumber;
      const userName = user.name;
      const userEmail = user.email;

      // --- UPDATED: Prepare product details with color and images for the email template ---
      const productsForEmail = await Promise.all(
        cartItems.map(async (item) => {
          return {
            productName: item.productId.name,
            quantity: item.quantity,
            price: item.productId.price,
            colorName: item.color.name,
            colorImage: item.color.images[0], // Use the first image for the email display
          };
        })
      );
      // -----------------------------------------------------------------------------------

      const shippingAddress = {
        fullName: user.name,
        streetAddress: user.address?.street || "N/A",
        hostelRoom: "N/A",
        cityStatePincode: `${user.address?.city || "N/A"}, ${
          user.address?.state || "N/A"
        } - ${user.address?.postalCode || "N/A"}`,
        phoneNumber: user.phoneNumber || "N/A",
      };

      const subtotal = productsForEmail.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const shippingCost = 0;
      const finalTotalAmount = totalAmount;

      const subject = `Your Rift Order (#${orderNumber}) is Confirmed!`;
      const htmlContent = orderConfirmedHtmlContent(
        orderNumber,
        userName,
        productsForEmail,
        subtotal,
        shippingCost,
        finalTotalAmount,
        shippingAddress
      );

      try {
        await sendEmail(userEmail, subject, htmlContent);
        console.log(
          `Order confirmation email sent to ${userEmail} for order #${orderNumber}`
        );
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
      }
    } else {
      console.warn(
        `User with ID ${userId} not found after order creation, skipping email.`
      );
    }

    console.log("order created successfully:", savedOrder);

    res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const order = await Order.findById(id)
      .populate("detailsOfCustomer", "name email phoneNumber address")
      .populate("detailsOfProduct.productId", "name images price colors"); // Populate colors field

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
