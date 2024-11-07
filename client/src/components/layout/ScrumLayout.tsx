import { ScrumSidebar } from "../ScrumSidebar";

type ScrumLayoutProps = React.PropsWithChildren;

export const ScrumLayout = (props: ScrumLayoutProps) => {
	return (
		<div className="w-screen h-screen flex flex-row">
			<ScrumSidebar />
			<div className="flex-1">{props.children}</div>
		</div>
	);
};
