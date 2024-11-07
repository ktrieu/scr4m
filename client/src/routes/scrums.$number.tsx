import { createFileRoute } from "@tanstack/react-router";
import { ScrumLayout } from "../components/layout/ScrumLayout";

const ScrumsRoute = () => {
	const { number } = Route.useParams();

	return (
		<ScrumLayout>
			<p>Scrum #{number}</p>
		</ScrumLayout>
	);
};

export const Route = createFileRoute("/scrums/$number")({
	component: ScrumsRoute,
});
