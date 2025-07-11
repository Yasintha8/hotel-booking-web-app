import User from "../models/user.js";
import { Webhook } from "svix";

export default async function clerkwebhooks(req, res) {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const evt = wh.verify(req.body, {
      "svix-id":        req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = evt;

    const userData = {
      _id:      data.id,
      email:    data.email_addresses[0]?.email_address,
      username: `${data.first_name} ${data.last_name}`,
      image:    data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        break;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
}
