import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<div className="bg-secondary h-screen">
			<Outlet />
		</div>
	),
});
