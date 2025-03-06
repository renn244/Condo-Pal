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

    async createPaymentSubscription(amount: number, title: string ,description: string, subscriptionId: string) {
        try {
            const response = await axios.post(
                `${process.env.PAYMONGO_API_URL}/checkout_sessions`,
                {
                    data: {
                        attributes: {
                            line_items: [
                                {
                                    name: title,
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
                            description: description,
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

    async createCondoPayment(rentCost: number, additionalCost: number, title: string, condoPaymentId: string) {
        try {
            const response = await axios.post(
                `${process.env.PAYMONGO_API_URL}/checkout_sessions`, 
                {
                    data: {
                        attributes: {
                            line_items: [
                                {
                                    name: 'monthly rent',
                                    description: 'this will be the monthly rent for the condo.',
                                    amount: parseInt(rentCost.toString() + "00"), // Amount in centavos (e.g., 1000.00 PHP)
                                    currency: "PHP",
                                    quantity: 1
                                }, 
                                {
                                    name: 'additional cost',
                                    description: "this will be the things like maintenance (if i'ts on you) and other things that you need to pay for as a tenant",
                                    amount: parseInt(additionalCost.toString() + "00"),
                                    currency: "PHP",
                                    quantity: 1
                                }
                            ],
                            payment_method_types: [ 
                                "billease", "card", "dob", "dob_ubp", "brankas_bdo", 
                                "brankas_landbank", "brankas_metrobank", "gcash", "grab_pay", "paymaya" 
                            ], // Supported payment methods
                            success_url: `${process.env.CLIENT_BASE_URL}/payment-status?condoPaymentId=${condoPaymentId}`,
                            cancel_url: `${process.env.CLIENT_BASE_URL}/payment-status?condoPaymentId=${condoPaymentId}`,
                            description: title,
                            send_email_receipt: true,
                            show_description: true
                        }
                    }
                },
                {...this.getHeaders('secret'), validateStatus: () => true}
            )

            return response.data.data
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

    getStatusCheckoutSession(payment: any) {
        const payments = payment.attributes.payments;
        if (!payments || payments.length === 0) return 'no_payments';
    
        // Sort payments by creation date in descending order
        const sortedPayments = payments.sort((a: any, b: any) => b.attributes.created_at - a.attributes.created_at);
    
        const status = sortedPayments[0]?.attributes?.status as 'pending' | 'paid' | 'failed';
    
        // If the most recent payment isn't 'paid', check for any 'paid' status in the array
        if (status !== 'paid') {
            const paidPayment = sortedPayments.find(payment => payment.attributes?.status === 'paid');
            if (paidPayment) return 'paid';
        }
    
        return status;
    }
}
