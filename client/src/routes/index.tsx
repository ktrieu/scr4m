import { createFileRoute } from "@tanstack/react-router";
import { ScrumLayout } from "../components/layout/ScrumLayout";

const Index = () => {
	return (
		<ScrumLayout>
			<p>Welcome to scrum.</p>
		</ScrumLayout>
	);
};

export const Route = createFileRoute("/")({
	component: Index,
});
