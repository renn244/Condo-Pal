import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymongoService {

    getHeaders(keyType: 'public' | 'secret') {
        const payMongoKey = keyType === 'public' ? 
        process.env.PAYMONGO_TEST_PUBLIC! :
        process.env.PAYMONGO_TEST_SECRET!

        return {
            headers: {
                Authorization: `Basic ${Buffer.from(payMongoKey).toString('base64')}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    }

    async createPaymentLink(amount: number, title: string ,description: string, subscriptionId: string) {
        try {
            const response = await axios.post(
                `${process.env.PAYMONGO_API_URL}/checkout_sessions`,
                {
                    data: {
                        attributes: {
                            line_items: [
                                {
                                    name: title,
                                    description: description,
                                    amount: parseInt(amount.toString() + "00"), // Amount in centavos (e.g., 1000.00 PHP)
                                    currency: "PHP",
                                    quantity: 1
                                }
                            ],
                            payment_method_types: [ 
                                "billease", "card", "dob", "dob_ubp", "brankas_bdo", 
                                "brankas_landbank", "brankas_metrobank", "gcash", "grab_pay", "paymaya" 
                            ], // Supported payment methods
                            success_url: `${process.env.CLIENT_BASE_URL}/payment-status?subscriptionId=${subscriptionId}`,
                            cancel_url: `${process.env.CLIENT_BASE_URL}/payment-status?subscriptionId=${subscriptionId}`,
                            description: "A subscription for CondoPal SaaS Online Application for condo management system",
                            send_email_receipt: true
                        }
                    }
                },
                {...this.getHeaders('secret'), validateStatus: () => true}
            )

            return response.data.data;
        } catch (error) {
            throw new InternalServerErrorException('Error creating payment links')
        }
    }

    async getPaymentLink(checkout_sessionId: string) {
        try {
            const response = await axios.get(
                `${process.env.PAYMONGO_API_URL}/checkout_sessions/${checkout_sessionId}`,
                {...this.getHeaders('secret'), validateStatus: () => true}
            )

            return response.data.data
        } catch (error) {
            throw new InternalServerErrorException('Error getting payment links')
        }
    }
}
