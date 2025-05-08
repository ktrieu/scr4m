import {
	HttpStatus,
	PublicCompaniesGetResponseSchema,
	type RegisterBody,
	RegisterReturnSchema,
} from "@scr4m/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Link,
	Navigate,
	createFileRoute,
	useNavigate,
} from "@tanstack/react-router";
import { apiGet, apiPost, isFetchError } from "../api";
import { ME_QUERY_KEY, useAuthContext } from "../auth";
import { GoogleLogin } from "../components/GoogleLogin";
import { AuthLayout } from "../components/layout/AuthLayout";

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

export const PUBLIC_COMPANIES_QUERY_KEY = ["public", "companies"];

const RegisterRoute = () => {
	const { companyId } = Route.useParams();

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const publicCompaniesQuery = useQuery({
		initialData: null,
		queryKey: PUBLIC_COMPANIES_QUERY_KEY,
		queryFn: async () => {
			const result = await apiGet(`/api/public/companies/${companyId}`);
			return PublicCompaniesGetResponseSchema.parse(result);
		},
	});

	const registerMutation = useMutation({
		mutationFn: async (body: RegisterBody) => {
			const data = await apiPost(`/api/auth/register/${companyId}`, body);
			return RegisterReturnSchema.parse(data);
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
			{publicCompaniesQuery.isSuccess && (
				<>
					<p className="text-xl mt-8 mb-6">
						Register with {publicCompaniesQuery.data?.name}:
					</p>
					<hr className="border-primary b-2 w-full mb-6" />
					<GoogleLogin
						onLogin={(token) => {
							registerMutation.mutate({ token });
						}}
					/>
					{registerMutation.status === "error" && (
						<RegisterError error={registerMutation.error} />
					)}
				</>
			)}
		</AuthLayout>
	);
};

export const Route = createFileRoute("/register/$companyId")({
	component: RegisterRoute,
});
