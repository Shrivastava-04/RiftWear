import Order from "./order.model.js";
import User from "../users/user.model.js";
import Product from "../products/product.model.js"; // Needed for detailed order items
import { sendEmail } from "../../services/email.services.js";
import mongoose from "mongoose";

// --- Email Template ---
const orderConfirmedHtmlContent = (
  orderNumber,
  userName,
  products,
  subtotal,
  shippingCost,
  totalAmount,
  shippingAddress,
  printingFee
) => {
  const { fullName, streetAddress, cityStatePincode, phoneNumber } =
    shippingAddress;
  const productRows = products
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #2e2e2e;">
        <div style="display: flex; align-items: center;">
          <img src="${item.image}" alt="${
        item.productName
      }" width="60" height="60" style="vertical-align: middle; margin-right: 10px; border-radius: 4px;">
          <div>
            <p style="margin: 0; font-weight: 600; color: #ffffff;">${
        item.productName
      }</p>
            <p style="margin: 0; font-size: 14px; color: #b0b0b0;">Size: ${
        item.size
      }, Color: ${item.colorName}</p>
            <p style="margin: 0; font-size: 14px; color: #b0b0b0;">Qty: ${
        item.quantity
      }</p>
            ${
        item.nameToPrint
          ? `<p style="margin: 0; font-size: 14px; color: #b0b0b0;">Custom Name: ${item.nameToPrint}</p>`
          : ""
      }
          </div>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #2e2e2e; text-align: right; vertical-align: top; font-weight: 600; color: #ffffff;">₹${(
        item.price * item.quantity
      ).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 20px auto; padding: 24px; background-color: #1a1a1a; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 20px;">Your Rift Order (#${orderNumber}) is Confirmed!</h1>
      <p style="color: #b0b0b0;">Hi ${userName}, thanks for your order. We've included the details below for your reference.</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="background-color: #2e2e2e; padding: 12px; border-bottom: 1px solid #444; text-align: left; color: #ffffff;">Product</th>
            <th style="background-color: #2e2e2e; padding: 12px; border-bottom: 1px solid #444; text-align: right; color: #ffffff;">Total</th>
          </tr>
        </thead>
        <tbody>${productRows}</tbody>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; text-align: right; font-weight: 600; color: #b0b0b0;">Subtotal:</td>
          <td style="padding: 8px; text-align: right; color: #b0b0b0;">₹${subtotal.toFixed(
    2
  )}</td>
        </tr>
        <tr>
          <td style="padding: 8px; text-align: right; font-weight: 600; color: #b0b0b0;">Custom Name Printing:</td>
          <td style="padding: 8px; text-align: right; color: #b0b0b0;">₹${printingFee.toFixed(
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
        <p style="margin: 0; font-size: 14px; color: #e5e7eb;">${fullName}<br>${streetAddress}<br>${cityStatePincode}<br>${phoneNumber}</p>
      </div>
      <p style="color: #b0b0b0;">Best,<br><strong style="color: #ffffff;">Team Rift</strong></p>
    </div>
  `;
};

const orderStatusUpdateHtmlContent = (orderNumber, userName, batchNumber) => {
  const userFirstName = userName.split(" ")[0];

  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 20px auto; padding: 24px; background-color: #1a1a1a; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">
      <div style="padding-bottom: 20px; text-align: center; border-bottom: 1px solid #2e2e2e;">
        <div style="font-size: 28px; font-weight: 800; color: #ffffff;">Rift</div>
      </div>
      <div style="padding: 24px 0;">
        <h2 style="color: #ffffff; font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 20px; font-style: italic;">Fresh Off the Press.</h2>
        <p style="color: #b0b0b0;">Hi ${userFirstName},</p>
        <p style="color: #b0b0b0;">Great news. Production for <strong>Batch #${batchNumber}</strong> is complete, and your order is now officially packed.</p>
        <p style="color: #b0b0b0;">It's getting ready for the final step—its journey to campus. The next email you receive from us will be the one with all the pickup details.</p>
        <p style="color: #b0b0b0;">The wait is almost over.</p>
      </div>
      <div style="padding-top: 20px; border-top: 1px solid #2e2e2e;">
        <p style="color: #b0b0b0;">Best,<br><strong style="color: #ffffff;">Team Rift</strong></p>
      </div>
    </div>
  `;
};

const readyForPickupHtmlContent = (order, batchNumber, pickupDetails) => {
  const userFirstName = order.customer.name.split(" ")[0];
  const productNames = order.items
    .map((item) => `${item.productName} (x${item.quantity})`)
    .join(", ");

  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 20px auto; padding: 24px; background-color: #1a1a1a; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">
      <div style="padding-bottom: 20px; text-align: center; border-bottom: 1px solid #2e2e2e;">
        <div style="font-size: 28px; font-weight: 800; color: #ffffff;">Rift</div>
      </div>
      <div style="padding: 24px 0;">
        <h2 style="color: #ffffff; font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 20px; font-style: italic;">Your Order is Ready!</h2>
        <p style="color: #b0b0b0;">Hi ${userFirstName},</p>
        <p style="color: #b0b0b0;">Great news. Your order from <strong>Batch #${batchNumber}</strong> has arrived on campus and is now ready for you to collect.</p>
        <p style="color: #b0b0b0;"><strong>Order:</strong> #${order.orderNumber}<br><strong>Contains:</strong> ${productNames}</p>
        <div style="margin: 24px 0; padding: 16px; border: 1px solid #444; border-radius: 6px;">
          <h3 style="color: #ffffff; margin-top: 0;">Pickup Instructions</h3>
          <p style="color: #b0b0b0; margin: 5px 0;"><strong>Location:</strong> ${pickupDetails.location}</p>
          <p style="color: #b0b0b0; margin: 5px 0;"><strong>Timings:</strong> ${pickupDetails.timings}</p>
          <p style="color: #b0b0b0; margin: 5px 0;"><strong>What to Bring:</strong> Please have your Order Number and Name ready.</p>
        </div>
        <p style="color: #b0b0b0;">We can't wait for you to finally have it.</p>
      </div>
      <div style="padding-top: 20px; border-top: 1px solid #2e2e2e;">
        <p style="color: #b0b0b0;">Best,<br><strong style="color: #ffffff;">Team Rift</strong></p>
      </div>
    </div>
  `;
};

const feedbackRequestHtmlContent = (userName) => {
  const userFirstName = userName.split(" ")[0];

  return `
    <div style="font-family: sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 20px auto; padding: 24px; background-color: #1a1a1a; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);">
      <div style="padding-bottom: 20px; text-align: center; border-bottom: 1px solid #2e2e2e;">
        <div style="font-size: 28px; font-weight: 800; color: #ffffff;">Rift</div>
      </div>
      <div style="padding: 24px 0;">
        <p style="color: #b0b0b0;">Hi ${userFirstName},</p>
        <p style="color: #b0b0b0;">By now, you should have your new gear from Rift, and we hope you're loving it.</p>
        <p style="color: #b0b0b0;">As a student-run brand, your feedback is everything to us. It's how we improve and create better products for our community.</p>
        <p style="color: #b0b0b0;">Could you take 30 seconds and let us know what you think? Just a simple <strong>reply to this email</strong> with a thought or two would be amazing. Good, bad, or any ideas you have—we want to hear it all.</p>
        <p style="color: #b0b0b0;">Thanks for being a vital part of building Rift.</p>
      </div>
      <div style="padding-top: 20px; border-top: 1px solid #2e2e2e;">
        <p style="color: #b0b0b0;">Best,<br><strong style="color: #ffffff;">Team Rift</strong></p>
      </div>
    </div>
  `;
};

// --- Controller Functions ---

export const createOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderPayload,
    } = req.body;
    const { user, shippingAddress, cartItems, pricingInfo } = orderPayload;
    console.log("starting to create ordere");
    console.log(orderPayload);
    // console.log(cartItems);
    const itemsSnapshot = cartItems.map((item) => ({
      product: {
        productId: item.product.productId,
        variantId: item.product.variantId,
        colorId: item.product.colorId,
      },
      size: item.size,
      quantity: item.quantity,
      nameToPrint: item.nameToPrint,
    }));

    const emailPayload = cartItems.map((item) => ({
      productName: item.product.productName,
      variantName: item.product.variantName,
      colorName: item.product.colorName,
      size: item.size,
      quantity: item.quantity,
      // nameToPrint: item.nameToPrint,
      price: item.product.price, // Price at the time of order
      image: item.product.image, // Representative image
    }));

    const newOrder = new Order({
      orderNumber: razorpay_order_id,
      customer: user.id,
      shippingInfo: shippingAddress,
      items: itemsSnapshot,
      paymentInfo: {
        status: "paid",
        method: "Razorpay",
        razorpay: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        },
      },
      pricingInfo: pricingInfo,
      orderStatus: "Processing",
    });
    console.log("start saving");
    const savedOrder = await newOrder.save();
    console.log("order saved");
    const dbUser = await User.findById(user.id);
    if (dbUser) {
      dbUser.cart = [];
      dbUser.orders.push(savedOrder._id);
      await dbUser.save();

      // --- ADDED: Email Notification Logic ---
      try {
        const emailHtml = orderConfirmedHtmlContent(
          savedOrder.orderNumber,
          dbUser.name,
          emailPayload, // Use the snapshot we already created
          pricingInfo.itemsPrice,
          pricingInfo.shippingPrice,
          pricingInfo.totalAmount,
          {
            // Construct the address object for the email
            fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            streetAddress: `${shippingAddress.street}${
              shippingAddress.landmark ? ", " + shippingAddress.landmark : ""
            }`,
            cityStatePincode: `${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}`,
            phoneNumber: shippingAddress.phoneNumber,
          },
          pricingInfo.taxPrice // Assuming taxPrice is used for printingFee
        );

        await sendEmail(
          dbUser.email,
          `Rift Order Confirmed: #${savedOrder.orderNumber}`,
          emailHtml
        );
      } catch (emailError) {
        // Log the error but don't fail the entire order process
        console.error(
          `Failed to send confirmation email for order ${savedOrder._id}:`,
          emailError
        );
      }
      // --- END: Email Notification Logic ---
    }
    console.log("order created successfully");
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.error("Error creating order in DB:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Internal Server Error while saving the order.",
        error: error.message,
      });
    }
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({
        createdAt: -1,
      })
      .lean();

    if (!orders || orders.length === 0) {
      return res.status(200).json({ success: true, orders: [] });
    }

    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const detailedItems = await Promise.all(
          order.items.map(async (item) => {
            const productDoc = await Product.findById(
              item.product.productId
            ).lean();
            if (!productDoc) {
              return {
                ...item,
                productName: "Product Not Found",
                image: "",
              };
            }
            const variantDoc = productDoc.variants.find((v) =>
              v._id.equals(item.product.variantId)
            );
            const colorDoc = variantDoc?.colors.find((c) =>
              c._id.equals(item.product.colorId)
            );
            return {
              ...item,
              productName: productDoc.name,
              image: colorDoc?.images[0] || "",
            };
          })
        );
        return { ...order, items: detailedItems };
      })
    );

    res.status(200).json({ success: true, orders: detailedOrders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error fetching orders." });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email")
      .lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    if (
      order.customer._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order." });
    }

    const detailedItems = await Promise.all(
      order.items.map(async (item) => {
        const productDoc = await Product.findById(
          item.product.productId
        ).lean();
        if (!productDoc) {
          return {
            ...item,
            productName: "Product Not Found",
            image: "",
            price: 0,
            variantName: "N/A",
            colorName: "N/A",
          };
        }
        const variantDoc = productDoc.variants.find((v) =>
          v._id.equals(item.product.variantId)
        );
        const colorDoc = variantDoc?.colors.find((c) =>
          c._id.equals(item.product.colorId)
        );
        return {
          ...item,
          productName: productDoc.name,
          image: colorDoc?.images[0] || "",
          price: colorDoc?.price || -1,
          variantName: variantDoc?.name || "Variant Not Found",
          colorName: colorDoc?.name || "Color Not Found",
        };
      })
    );
    order.items = detailedItems;

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error fetching order." });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, details } = req.body;
    const order = await Order.findById(req.params.id).populate(
      "customer",
      "name email"
    );

    if (!order) return res.status(404).json({ message: "Order not found." });

    order.orderStatus = status;

    if (status === "Packed") {
      const batchNumber = details?.batchNumber;
      if (!batchNumber)
        return res
          .status(400)
          .json({ message: "Batch number is required for 'Packed' status." });
      try {
        const subject = `Getting closer... An update on your Rift order #${order.orderNumber}.`;
        const htmlContent = orderStatusUpdateHtmlContent(
          order.orderNumber,
          order.customer.name,
          batchNumber
        );
        await sendEmail(order.customer.email, subject, htmlContent);
      } catch (emailError) {
        console.error("Failed to send 'Packed' email:", emailError);
      }
    } else if (status === "Shipped") {
      const { batchNumber, pickupDetails } = details || {};
      if (!batchNumber || !pickupDetails?.location || !pickupDetails?.timings)
        return res
          .status(400)
          .json({ message: "Batch number and pickup details are required." });
      try {
        const subject = `Your Rift Order (#${order.orderNumber}) is Ready for Pickup!`;
        const htmlContent = readyForPickupHtmlContent(
          order,
          batchNumber,
          pickupDetails
        );
        await sendEmail(order.customer.email, subject, htmlContent);
      } catch (emailError) {
        console.error("Failed to send 'Ready for Pickup' email:", emailError);
      }
      order.shippingDetails.shippedAt = Date.now();
    } else if (status === "Delivered") {
      try {
        const subject =
          "How's the new gear? A quick question about your Rift order.";
        const htmlContent = feedbackRequestHtmlContent(order.customer.name);
        await sendEmail(order.customer.email, subject, htmlContent);
      } catch (emailError) {
        console.error("Failed to send 'Feedback' email:", emailError);
      }
      order.shippingDetails.deliveredAt = Date.now();
    }

    await order.save();
    res
      .status(200)
      .json({ success: true, message: `Order status updated to ${status}.` });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error updating order status." });
  }
};
