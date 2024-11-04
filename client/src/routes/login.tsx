import { HttpStatus, type LoginBody, LoginReturnSchema } from "@scr4m/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, createFileRoute, useNavigate } from "@tanstack/react-router";
import { apiPost, isFetchError } from "../api";
import { ME_QUERY_KEY, useAuthContext } from "../auth";
import { GoogleLogin } from "../components/GoogleLogin";
import { AuthLayout } from "../components/layout/AuthLayout";

const LoginError = (props: { error: unknown }) => {
	if (!isFetchError(props.error)) {
		return null;
	}

	switch (props.error.status) {
		case HttpStatus.UNAUTHORIZED:
			return (
				<p className="text-sm mt-3">There was an error with your login.</p>
			);
		case HttpStatus.BAD_REQUEST:
			return <p className="text-sm mt-3">No matching user was found.</p>;
	}
};

const LoginRoute = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const loginMutation = useMutation({
		mutationFn: async (body: LoginBody) => {
			const data = await apiPost("/api/auth/login", body);
			return LoginReturnSchema.parse(data);
		},
		onSuccess: (data) => {
			queryClient.setQueryData(ME_QUERY_KEY, data);
			navigate({ to: "/" });
		},
	});

	const { data } = useAuthContext();

	if (data) {
		return <Navigate to={"/"} />;
	}

	return (
		<AuthLayout>
			<p className="text-xl mt-8 mb-6">Login to continue to scrum:</p>
			<hr className="border-primary b-2 w-full mb-6" />
			<GoogleLogin
				onLogin={(token) => {
					loginMutation.mutate({ token });
				}}
			/>
			{loginMutation.status === "error" && (
				<LoginError error={loginMutation.error} />
			)}
		</AuthLayout>
	);
};

export const Route = createFileRoute("/login")({
	component: LoginRoute,
});
