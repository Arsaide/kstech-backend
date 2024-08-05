require("dotenv").config();
const nodemailer = require("nodemailer");

class Emailsend {
  transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  }

  async sendmessage({ products }) {
    await this.transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Order Confirmation",
      html: `
        <div style="">
          <h2>Order Confirmation</h2>
          <p><strong>Order Number:</strong> ${products.client.order}</p>
          <p><strong>Name:</strong> ${products.client.clientName}</p>
          <p><strong>Surname:</strong> ${products.client.surname}</p>
          <p><strong>Number:</strong> ${products.client.number}</p>
          <p><strong>Email:</strong> ${products.client.email}</p>
          <p><strong>Feedback:</strong> ${products.client.feedback ? "Yes" : "No"}</p>
          <p><strong>Country:</strong> ${products.client.country}</p>
          <p><strong>Town:</strong> ${products.client.town}</p>
          <p><strong>Street:</strong> ${products.client.street}</p>
          <p><strong>Office:</strong> ${products.client.office}</p>
          <p><strong>Comment:</strong> ${products.client.comment}</p>
          
          <h3>Products:</h3>
          ${products.products
            .map(
              (product) => `
            <div style="margin-bottom: 10px;">
              <p><strong>Product ID:</strong> ${product.id}</p>
              <p><a href="${process.env.FRONTEND_HOST}/catalog/subcatalog/product?id=${product.id}" style="color: blue; text-decoration: none;">View Product</a></p>
            </div>
          `
            )
            .join("")}
          
          <p><strong>Delivery Method:</strong> ${products.deliveryMethod}</p>
        </div>
      `,
    });
  }
}

module.exports = Emailsend;
