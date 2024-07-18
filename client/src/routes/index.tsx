import { createFileRoute } from "@tanstack/react-router";
import { useAuthContext } from "../auth";

const Index = () => {
	const { user } = useAuthContext();

	return (
		<>
			<pre>{JSON.stringify(user)}</pre>
			<p>Index</p>
		</>
	);
};

export const Route = createFileRoute("/")({
	component: Index,
});
