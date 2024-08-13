declare const nodemailer: any;
declare class Emailsend {
    transporter: any;
    constructor();
    sendmessage({ products }: {
        products: any;
    }): Promise<void>;
}
