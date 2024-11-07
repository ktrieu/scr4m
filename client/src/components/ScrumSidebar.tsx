import { type ScrumListObject, ScrumListReturnSchema } from "@scr4m/common";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../api";

type ScrumSidebarItemProps = {
	scrum: ScrumListObject;
};

const ScrumSidebarItem = (props: ScrumSidebarItemProps) => {
	const { title, number } = props.scrum;

	return (
		<div className="p-3 hover:bg-slate-300">
			<h3>Scrum {number}</h3>
			<p className="text-sm h-12">
				{title || <span className="italic">Untitled</span>}
			</p>
		</div>
	);
};

type ScrumSidebarProps = {
	onScrumSelected: (id: number) => void;
};

export const SCRUM_LIST_KEY = ["scrums", "list"];

export const ScrumSidebar = (props: ScrumSidebarProps) => {
	const { data } = useQuery({
		initialData: {
			scrums: [],
		},
		queryKey: SCRUM_LIST_KEY,
		queryFn: async () => {
			const result = await apiGet("/api/scrums");
			return ScrumListReturnSchema.parse(result);
		},
	});

	return (
		<div className="h-full overflow-y-scroll">
			{data.scrums.map((scrum) => (
				<ScrumSidebarItem key={scrum.id} scrum={scrum} />
			))}
		</div>
	);
};
