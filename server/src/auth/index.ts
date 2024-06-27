import { FastifyRequest } from "fastify";
import { LoginTicket, OAuth2Client } from "google-auth-library";

const googleOAuthClient = new OAuth2Client();

export const verifyGoogleToken = async (
	request: FastifyRequest,
	token: string,
): Promise<LoginTicket | null> => {
	try {
		const result = await googleOAuthClient.verifyIdToken({
			idToken: token,
		});

		return result;
	} catch (e) {
		request.log.error({ tokenError: e }, "Error validating Google token");
		return null;
	}
};
