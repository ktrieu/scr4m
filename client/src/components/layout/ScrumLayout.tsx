import { ScrumSidebar } from "../ScrumSidebar";

type ScrumLayoutProps = React.PropsWithChildren;

export const ScrumLayout = (props: ScrumLayoutProps) => {
	const onScrumSelected = (id: number) => {
		console.log(`Scrum ${id} selected`);
	};

	return (
		<div className="w-screen h-screen flex flex-row">
			<div className="bg-slate-200 w-1/5">
				<ScrumSidebar onScrumSelected={onScrumSelected} />
			</div>
			<div className="flex-1">{props.children}</div>
		</div>
	);
};
