require("dotenv").config();
const nodemailer = require("nodemailer");
class Emailsend {
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
            subject: "Підтвердження замовлення",
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Підтвердження замовлення</h2>
          <p><strong>Номер замовлення:</strong> ${products.client.order}</p>
          <p><strong>Ім'я:</strong> ${products.client.clientName}</p>
          <p><strong>Прізвище:</strong> ${products.client.surname}</p>
          <p><strong>Номер телефону:</strong> ${products.client.number}</p>
          <p><strong>Email:</strong> ${products.client.email}</p>
          <p><strong>Зворотний зв'язок:</strong> ${products.client.feedback ? 'Так' : 'Ні'}</p>
          <p><strong>Країна:</strong> ${products.client.country}</p>
          <p><strong>Місто:</strong> ${products.client.town}</p>
          <p><strong>Вулиця:</strong> ${products.client.street}</p>
          <p><strong>Офіс:</strong> ${products.client.office}</p>
          <p><strong>Коментар:</strong> ${products.client.comment}</p>
          
          <h3>Продукти:</h3>
          ${products.products.map(product => `
            <div style="margin-bottom: 10px;">
              <p><strong>ID продукту:</strong> ${product.id}</p>
              <p><a href="${process.env.FRONTEND_HOST}/catalog/subcatalog/${product.id}" style="color: blue; text-decoration: none;">Переглянути продукт</a></p>
            </div>
          `).join('')}
          
          <p><strong>Метод доставки:</strong> ${products.deliveryMethod}</p>
        </div>
      `,
        });
    }
}
module.exports = Emailsend;
//# sourceMappingURL=email.js.map