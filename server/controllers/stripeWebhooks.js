import Stripe from "stripe";
import Booking from "../models/booking.js";

//API to handle Stripe Webhooks
export const stripeWebhooks = async (request, response) => {
    //Stripe Gateway Initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if(event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        //Getting Session Metadata
        const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId,
        });

        const {bookingId} = session.data[0].metadata;

        //Mark Payment as Paid
        const booking = await Booking.findByIdAndUpdate(bookingId, {isPaid: true, paymentMethod: "Stripe"});
        booking.status = "Paid";
        await booking.save();
    }else{
        console.log("Unhandled event type :", event.type);
    }
    response.json({received: true});
}