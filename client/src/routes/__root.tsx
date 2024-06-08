import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
    component: () => (
        <>
            <p>SCR4M</p>
            <Outlet />
        </>
    ),
})