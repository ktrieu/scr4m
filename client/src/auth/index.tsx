import { type MeReturn, MeReturnSchema } from "@scr4m/common/routes/me";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { apiGet, isFetchError } from "../api";

type AuthContext = {
	data: MeReturn | null;
};

const authContext = React.createContext<AuthContext>({ data: null });

export const ME_QUERY_KEY = ["auth", "me"];

export const useAuthContext = () => useContext(authContext);

export const AuthProvider = (props: { children?: React.ReactNode }) => {
	const { data } = useQuery({
		initialData: null,
		queryKey: ME_QUERY_KEY,
		queryFn: async () => {
			try {
				const result = await apiGet("/api/auth/me");
				return MeReturnSchema.parse(result);
			} catch (e) {
				if (isFetchError(e) && e.status === 401) {
					// 401 unauthorized means we're not logged in.
					return null;
				}

				throw e;
			}
		},
	});

	return (
		<authContext.Provider value={{ data }}>
			{props.children}
		</authContext.Provider>
	);
};
