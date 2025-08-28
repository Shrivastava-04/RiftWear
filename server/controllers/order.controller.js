// import mongoose from "mongoose";
// import Order from "../models/orders.model.js";
// import User from "../models/user.model.js";
// import Product from "../models/product.model.js";
// import { sendEmail } from "../services/emailService.js";

// // Define the orderConfirmedHtmlContent function with updated product info
// const orderConfirmedHtmlContent = (
//   orderNumber,
//   userName,
//   products,
//   subtotal,
//   shippingCost,
//   totalAmount,
//   shippingAddress
// ) => {
//   const { fullName, streetAddress, cityStatePincode, phoneNumber } =
//     shippingAddress;

//   const productRows = products
//     .map(
//       (item) => `
//     <tr>
//       <td class="table-cell">
//         <div style="display: flex; align-items: center;">
//           <img src="${item.colorImage}" alt="${
//         item.productName
//       }" width="60" height="60" style="vertical-align: middle; margin-right: 10px; border-radius: 4px;">
//           <p style="margin: 0; font-weight: 600;">${item.productName}</p>
//         </div>
//         <div style="font-size: 12px; color: #b0b0b0; padding-left: 70px;">
//           <p style="margin: 0;">Size: ${item.size}, Color: ${item.colorName}</p>
//           <p style="margin: 0;">Qty: ${item.quantity}</p>
//         </div>
//       </td>
//       <td class="table-cell right" style="vertical-align: top; font-weight: 600;">₹${(
//         item.price * item.quantity
//       ).toFixed(2)}</td>
//     </tr>
//   `
//     )
//     .join("");

//   return `
//     <div style="font-family: sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 20px auto; padding: 24px; background-color: #1a1a1a; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">
//       <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 20px;">Your Rift Order (#${orderNumber}) is Confirmed!</h1>

//       <p style="color: #b0b0b0;">Hi ${userName},</p>
//       <p style="color: #b0b0b0;">Thanks for your order. We've confirmed it and have included the details below for your reference.</p>

//       <p style="font-size: 14px; color: #b0b0b0;"><strong>Order Number:</strong> ${orderNumber} &nbsp;&nbsp; <strong>Date:</strong> ${new Date().toLocaleDateString(
//     "en-GB"
//   )}</p>

//       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px; border-collapse: collapse;">
//         <thead>
//           <tr>
//             <th style="background-color: #2e2e2e; padding: 12px; border-bottom: 1px solid #444; text-align: left; color: #ffffff;">Product</th>
//             <th style="background-color: #2e2e2e; padding: 12px; border-bottom: 1px solid #444; text-align: right; color: #ffffff;">Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${productRows}
//         </tbody>
//       </table>

//       <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px; border-collapse: collapse;">
//         <tr>
//           <td style="padding: 8px; text-align: right; font-weight: 600; color: #b0b0b0;">Subtotal:</td>
//           <td style="padding: 8px; text-align: right; color: #b0b0b0;">₹${subtotal.toFixed(
//             2
//           )}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px; text-align: right; font-weight: 600; color: #b0b0b0;">Shipping:</td>
//           <td style="padding: 8px; text-align: right; color: #b0b0b0;">₹${shippingCost.toFixed(
//             2
//           )}</td>
//         </tr>
//         <tr>
//           <td style="padding: 12px 8px; text-align: right; font-weight: 700; font-size: 1.2em; border-top: 1px solid #2e2e2e; color: #e89846;">Total (INR):</td>
//           <td style="padding: 12px 8px; text-align: right; font-weight: 700; font-size: 1.2em; border-top: 1px solid #2e2e2e; color: #e89846;">₹${totalAmount.toFixed(
//             2
//           )}</td>
//         </tr>
//       </table>

//       <div style="background-color: #2e2e2e; padding: 16px; border-radius: 4px; margin-top: 20px;">
//         <p style="font-weight: 700; margin-top: 0; margin-bottom: 5px; color: #ffffff;">Shipping to:</p>
//         <p style="margin: 0; font-size: 14px; color: #e5e7eb;">
//           ${fullName}<br>
//           ${streetAddress}<br>
//           ${cityStatePincode}<br>
//           ${phoneNumber}
//         </p>
//       </div>

//       <p style="color: #b0b0b0;">Best,</p>
//       <p style="margin: 0; color: #ffffff;"><strong>Team Rift</strong></p>
//     </div>
//   `;
// };

// export const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       razorpayPaymentId,
//       razorpayOrderId,
//       totalAmount,
//     } = req.body;

//     const newOrder = new Order({
//       orderNumber: razorpayOrderId,
//       detailsOfCustomer: userId,
//       detailsOfProduct: cartItems.map((item) => ({
//         productId: item.productId._id,
//         size: item.size,
//         color: item.color, // The entire color object is now passed to the schema
//         variety: item.variety,
//         quantity: item.quantity,
//       })),
//       amount: totalAmount,
//       razorpayId: razorpayPaymentId,
//     });

//     const savedOrder = await newOrder.save();
//     console.log("razorpay order saved: from createOrder function", savedOrder);

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { cartItem: [] },
//       { new: true }
//     ).populate("address");

//     await User.findByIdAndUpdate(userId, { $push: { order: savedOrder._id } });

//     if (user) {
//       const orderNumber = savedOrder.orderNumber;
//       const userName = user.name;
//       const userEmail = user.email;

//       // --- UPDATED: Prepare product details with color and images for the email template ---
//       const productsForEmail = await Promise.all(
//         cartItems.map(async (item) => {
//           return {
//             productName: item.productId.name,
//             quantity: item.quantity,
//             price: item.productId.price,
//             colorName: item.color.name,
//             colorImage: item.color.images[0], // Use the first image for the email display
//           };
//         })
//       );
//       // -----------------------------------------------------------------------------------

//       const shippingAddress = {
//         fullName: user.name,
//         streetAddress: user.address?.street || "N/A",
//         hostelRoom: "N/A",
//         cityStatePincode: `${user.address?.city || "N/A"}, ${
//           user.address?.state || "N/A"
//         } - ${user.address?.postalCode || "N/A"}`,
//         phoneNumber: user.phoneNumber || "N/A",
//       };

//       const subtotal = productsForEmail.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       );
//       const shippingCost = 0;
//       const finalTotalAmount = totalAmount;

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
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const getOrderById = async (req, res) => {
//   try {
//     const { id } = req.query;
//     console.log(id);

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid order ID format" });
//     }

//     const order = await Order.findById(id)
//       .populate("detailsOfCustomer", "name email phoneNumber address")
//       .populate("detailsOfProduct.productId", "name images price colors"); // Populate colors field

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
import { sendEmail } from "../services/emailService.js";

// This email template function is fine and doesn't need changes
// const orderConfirmedHtmlContent = (/*...args*/) => { /*...*/ };
const orderConfirmedHtmlContent = (
  orderNumber,
  userName,
  products,
  subtotal,
  shippingCost,
  totalAmount,
  shippingAddress
) => {
  const { fullName, streetAddress, cityStatePincode, phoneNumber } =
    shippingAddress;

  const productRows = products
    .map(
      (item) => `
    <tr>
      <td class="table-cell">
        <div style="display: flex; align-items: center;">
          <img src="${item.colorImage}" alt="${
        item.productName
      }" width="60" height="60" style="vertical-align: middle; margin-right: 10px; border-radius: 4px;">
          <p style="margin: 0; font-weight: 600;">${item.productName}</p>
        </div>
        <div style="font-size: 12px; color: #b0b0b0; padding-left: 70px;">
          <p style="margin: 0;">Size: ${item.size}, Color: ${item.colorName}</p>
          <p style="margin: 0;">Qty: ${item.quantity}</p>
        </div>
      </td>
      <td class="table-cell right" style="vertical-align: top; font-weight: 600;">₹${(
        item.price * item.quantity
      ).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 20px auto; padding: 24px; background-color: #1a1a1a; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 20px;">Your Rift Order (#${orderNumber}) is Confirmed!</h1>
      
      <p style="color: #b0b0b0;">Hi ${userName},</p>
      <p style="color: #b0b0b0;">Thanks for your order. We've confirmed it and have included the details below for your reference.</p>
      
      <p style="font-size: 14px; color: #b0b0b0;"><strong>Order Number:</strong> ${orderNumber} &nbsp;&nbsp; <strong>Date:</strong> ${new Date().toLocaleDateString(
    "en-GB"
  )}</p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="background-color: #2e2e2e; padding: 12px; border-bottom: 1px solid #444; text-align: left; color: #ffffff;">Product</th>
            <th style="background-color: #2e2e2e; padding: 12px; border-bottom: 1px solid #444; text-align: right; color: #ffffff;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; text-align: right; font-weight: 600; color: #b0b0b0;">Subtotal:</td>
          <td style="padding: 8px; text-align: right; color: #b0b0b0;">₹${subtotal.toFixed(
            2
          )}</td>
        </tr>
        <tr>
          <td style="padding: 8px; text-align: right; font-weight: 600; color: #b0b0b0;">Shipping:</td>
          <td style="padding: 8px; text-align: right; color: #b0b0b0;">₹${shippingCost.toFixed(
            2
          )}</td>
        </tr>
        <tr>
          <td style="padding: 12px 8px; text-align: right; font-weight: 700; font-size: 1.2em; border-top: 1px solid #2e2e2e; color: #e89846;">Total (INR):</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 700; font-size: 1.2em; border-top: 1px solid #2e2e2e; color: #e89846;">₹${totalAmount.toFixed(
            2
          )}</td>
        </tr>
      </table>

      <div style="background-color: #2e2e2e; padding: 16px; border-radius: 4px; margin-top: 20px;">
        <p style="font-weight: 700; margin-top: 0; margin-bottom: 5px; color: #ffffff;">Shipping to:</p>
        <p style="margin: 0; font-size: 14px; color: #e5e7eb;">
          ${fullName}<br>
          ${streetAddress}<br>
          ${cityStatePincode}<br>
          ${phoneNumber}
        </p>
      </div>

      <p style="color: #b0b0b0;">Best,</p>
      <p style="margin: 0; color: #ffffff;"><strong>Team Rift</strong></p>
    </div>
  `;
};

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      razorpayPaymentId,
      razorpayOrderId, // Now being received from the frontend
      totalAmount,
      shippingFee,
      subTotal,
    } = req.body;

    // --- UPDATED: Create the new order with the correct schema fields ---
    const newOrder = new Order({
      orderNumber: razorpayOrderId, // Use the ID from Razorpay
      customer: userId, // Field is 'customer', not 'detailsOfCustomer'
      totalAmount: totalAmount, // Field is 'totalAmount', not 'amount'
      razorpayId: razorpayPaymentId,

      // Create the item snapshot from the populated cartItems
      items: cartItems.map((item) => {
        const variant = item.productId.variants.find(
          (v) => v._id.toString() === item.variantId.toString()
        );
        const color = variant.colors.find((c) => c.name === item.colorName);

        return {
          productId: item.productId._id,
          variantId: item.variantId,
          quantity: item.quantity,
          productName: item.productId.name,
          variantName: variant.name,
          size: item.size,
          colorName: item.colorName,
          price: variant.price, // The price at the time of purchase
          image: color.images[0] || item.productId.images[0], // A representative image
        };
      }),
    });

    const savedOrder = await newOrder.save();

    // Find the user to clear their cart and send an email
    const user = await User.findById(userId);

    if (user) {
      user.cartItem = []; // Clear the cart
      user.order.push(savedOrder._id); // Add order reference to user
      await user.save();

      // --- Email logic now uses the correct snapshot data ---
      const productsForEmail = savedOrder.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        colorName: item.colorName,
        colorImage: item.image,
      }));

      const shippingAddress = {
        fullName: user.name,
        streetAddress: user.address?.street || "N/A",
        cityStatePincode: `${user.address?.city || "N/A"}, ${
          user.address?.state || "N/A"
        } - ${user.address?.postalCode || "N/A"}`,
        phoneNumber: user.phoneNumber || "N/A",
      };

      const subject = `Your Rift Order (#${savedOrder.orderNumber}) is Confirmed!`;
      const htmlContent = orderConfirmedHtmlContent(
        savedOrder.orderNumber,
        user.name,
        productsForEmail,
        subTotal, // subtotal is the same as totalAmount in this case
        shippingFee, // shippingCost
        totalAmount,
        shippingAddress
      );

      try {
        await sendEmail(user.email, subject, htmlContent);
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
      }
    }

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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    // UPDATED: Use correct field names for populate
    const order = await Order.findById(id).populate(
      "customer",
      "name email phoneNumber address"
    );
    // No longer need to populate items, as they are a snapshot

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
