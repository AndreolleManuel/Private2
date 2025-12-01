import { httpStatusCodes, BadRequestError, sendEmail } from "../../utils/index.js";

export const contactController = {
  async sendMessage(req, res) {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      throw new BadRequestError("All fields are required", { fields: ["name", "email", "message"] });
    }
    // User confirmation
    console.log("Sending email confirmation to user...");
    await sendEmail(name, email, message, process.env.EMAILJS_TEMPLATE_CONFIRMATION);

    // Team notification
    console.log("Sending email notification to team...");
    await sendEmail(name, email, message, process.env.EMAILJS_TEMPLATE_NOTIFICATION);

    res.status(httpStatusCodes.OK).json({
      success: true,
      message: "Message received. A confirmation email has been sent to your address.",
    });
  },
};