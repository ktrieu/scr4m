import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "../components/layout/AuthLayout";
import { GoogleLogin } from "../components/GoogleLogin";
import { HttpStatus, LoginBody } from "@scr4m/common";
import { useMutation } from "@tanstack/react-query";
import { apiPost, isFetchError } from "../api";

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
	const loginMutation = useMutation({
		mutationFn: async (body: LoginBody) => {
			return apiPost(`/api/auth/login`, body);
		},
		onSuccess: () => {
			alert("Login successful!");
		},
	});

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
