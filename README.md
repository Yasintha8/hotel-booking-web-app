# Hotel Booking Web Application (MERN Stack)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-v18-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-v16-yellow.svg)
![Express](https://img.shields.io/badge/Express-v4.18-red.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-v6.0-green.svg)

A full-featured hotel booking platform built with the **MERN Stack** (MongoDB, Express, React, Node.js).  
The application allows users to browse hotels and rooms, make secure bookings, and hotel owners to manage listings. Authentication is handled via **Clerk**, and payments are processed using **Stripe**.

---

## 🚀 Features

### 👤 User Functionality
- Sign up / login using **Clerk Authentication** (Email / Username / Phone)
- Search and view hotel rooms
- Check availability by date
- Book rooms with **Stripe** payment integration
- View past bookings
- Receive email confirmations (via **Nodemailer + Brevo**)

### 🏨 Hotel Owner Functionality
- Add hotels and rooms
- Upload multiple images (stored via **Cloudinary**)
- Manage room availability
- View all bookings for their hotels
  
---

## 🛠️ Tech Stack

| Technology        | Purpose                         |
|-------------------|---------------------------------|
| **MongoDB**       | Database                        |
| **Express.js**    | Backend Framework               |
| **React.js**      | Frontend Library                |
| **Node.js**       | Backend Runtime                 |
| **Clerk**         | User Authentication             |
| **Cloudinary**    | Image Upload & Management       |
| **Stripe**        | Payment Gateway                 |
| **Nodemailer**    | Email Notifications             |
| **Brevo (SendinBlue)** | SMTP Email Delivery         |

---

## 🔐 Authentication

Authentication is handled using **Clerk**, which supports:
- Email + Password
- Username
- Phone number
- Session handling and JWTs

---

## 💸 Payments

**Stripe** is used to handle secure card payments for hotel bookings.  
Stripe webhooks are configured to verify and process transactions in real-time.

---

## 📷 Image Upload

Hotel and room images are uploaded to **Cloudinary** using REST API calls, allowing optimized and reliable image storage.

---

## 📧 Email System

**Nodemailer** and **Brevo** are used to:
- Send booking confirmations to users
- Notify hotel owners of new bookings

---

## 🧪 Testing

- API tested using Postman
- Stripe payments tested using test cards
- Clerk authentication tested across flows

---

