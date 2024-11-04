import { createFileRoute } from "@tanstack/react-router";
import { useAuthContext } from "../auth";

const Index = () => {
	const { data } = useAuthContext();

	return (
		<>
			<pre>{JSON.stringify(data)}</pre>
			<p>Index</p>
		</>
	);
};

export const Route = createFileRoute("/")({
	component: Index,
});
