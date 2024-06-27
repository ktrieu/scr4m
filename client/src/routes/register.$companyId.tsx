import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { AuthLayout } from "../components/layout/AuthLayout";
import { GoogleLogin } from "../components/GoogleLogin";
import { useMutation } from "@tanstack/react-query";
import { HttpStatus, RegisterBody } from "@scr4m/common";
import { apiPost, isFetchError } from "../api";

const RegisterError = (props: { error: unknown }) => {
	if (!isFetchError(props.error)) {
		return null;
	}

	switch (props.error.status) {
		case HttpStatus.UNAUTHORIZED:
			return (
				<p className="text-sm mt-3">
					There was an error with your registration.
				</p>
			);
		case HttpStatus.BAD_REQUEST:
			return (
				<>
					<p className="text-sm mt-3">A matching user already exists.</p>
					<p className="text-sm">
						<Link to="/login" className="underline">
							Login
						</Link>{" "}
						here.
					</p>
				</>
			);
	}
};

const RegisterRoute = () => {
	const { companyId } = Route.useParams();

	const registerMutation = useMutation({
		mutationFn: async (body: RegisterBody) => {
			return apiPost(`/api/auth/register/${companyId}`, body);
		},
		onSuccess: () => {
			alert("Register successful!");
		},
	});

	return (
		<AuthLayout>
			<p className="text-xl mt-8 mb-6">Register with company {companyId}:</p>
			<hr className="border-primary b-2 w-full mb-6" />
			<GoogleLogin
				onLogin={(token) => {
					registerMutation.mutate({ token });
				}}
			/>
			{registerMutation.status === "error" && (
				<RegisterError error={registerMutation.error} />
			)}
		</AuthLayout>
	);
};

export const Route = createFileRoute("/register/$companyId")({
	component: RegisterRoute,
});
