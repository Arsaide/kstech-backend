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
      to: "artemk2504@gmail.com",
      text: `
         Order Number: ${products.client.order}
    Name: ${products.client.clientName}
    Surname: ${products.client.surname}
    Number: ${products.client.number}
    Email: ${products.client.email}
    Feedback: ${products.client.feedback ? 'Yes' : 'No'}
    Country: ${products.client.country}
    Town: ${products.client.town}
    Street: ${products.client.street}
    Office: ${products.client.office}
    Comment: ${products.client.comment}
    
    Products:
    ${products.products.map(product => `
      Product ID: ${product.id}
      <a href="https://kstech-frontend.vercel.app/catalog/subcatalog/product?id=${product.id}">${product.id}</a>
   
 
    `).join('\n')}
        `,
    });
  }
}

module.exports = Emailsend;
