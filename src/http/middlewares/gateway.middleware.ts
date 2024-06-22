import { NotAuthorizedError } from '../../config/errorHandler.config';
import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import { EnvVariable } from '../../config/envVariable.config';
const serviceType: string[] = [
	'auth',
	'seller',
	'gig',
	'search',
	'buyer',
	'message',
	'order',
	'review',
];

export function verifyGatewayRequest(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	if (!req.headers?.gatewaytoken)
		throw new NotAuthorizedError(
			'Invalid request',
			'verifygateway method : Request not coming from api gatewaytoken'
		);
	const token: string = req.headers.gatewaytoken as string;
	try {
		const payload: { id: string; iat: number } = JWT.verify(
			token,
			EnvVariable.NEXT_PUBLIC_GATEWAY_JWT_TOKEN
		) as { id: string; iat: number };
		
		if (!serviceType.includes(payload.id))
			throw new NotAuthorizedError(
				'Invalid request',
				'verifygateway method : Request not coming from api gatewaytoken'
			);
	} catch (error) {
		throw new NotAuthorizedError(
			'Invalid request',
			'verifygateway method : Request not coming from api gatewaytoken'
		);
	}
    next();
}
