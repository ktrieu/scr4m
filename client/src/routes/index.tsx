import { createFileRoute } from "@tanstack/react-router";
import { useAuthContext } from "../auth";
import { ScrumLayout } from "../components/layout/ScrumLayout";

const Index = () => {
	const { data } = useAuthContext();

	return (
		<ScrumLayout>
			<p>Welcome to scrum.</p>
		</ScrumLayout>
	);
};

export const Route = createFileRoute("/")({
	component: Index,
});
