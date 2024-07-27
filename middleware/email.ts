require('dotenv').config()
const nodemailer=require('nodemailer')
 
class Emailsend {
    transporter:any
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        });
    } 
    
async sendmessage({ products}){
    console.log(`${products.number}
        ${products.name}

        <а href=https://kstech-admin.vercel.app/products-list/${products.link}>${products.name}</a>
        ${products.deliveryMethod}
        ${products.paymentMethod}
        ${products.turningMethod}
        ${products.colors}`)
      await this.transporter.sendMail({
        from:process.env.EMAIL,
        to:process.env.EMAIL,
        text:`
        ${products.number}
        ${products.name}

        <а href=https://kstech-admin.vercel.app/products-list/${products.link}>${products.name}</a>
        ${products.deliveryMethod}
        ${products.paymentMethod}
        ${products.turningMethod}
        ${products.colors}
        `
    })
    }
}

module.exports=Emailsend