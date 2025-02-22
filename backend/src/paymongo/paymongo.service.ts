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

    async createPaymentLink(amount: number, description: string) {
        try {
            const response = await axios.post(
                `${process.env.PAYMONGO_API_URL}/links`,
                {
                    data: {
                        attributes: {
                            amount: parseInt(amount.toString() + '00'),
                            description: description,
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

    async getPaymentLink(linkId: string) {
        try {
            const response = await axios.get(
                `${process.env.PAYMONGO_API_URL}/links/${linkId}`,
                {...this.getHeaders('secret'), validateStatus: () => true}
            )

            return response.data.data
        } catch (error) {
            throw new InternalServerErrorException('Error getting payment links')
        }
    }
}
