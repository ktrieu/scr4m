import { type ScrumListObject, ScrumListReturnSchema } from "@scr4m/common";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../api";
import { Link } from "@tanstack/react-router";

type ScrumSidebarItemProps = {
	scrum: ScrumListObject;
};

const ScrumSidebarItem = (props: ScrumSidebarItemProps) => {
	const { title, number } = props.scrum;

	const url = `/scrums/${number}`;

	return (
		<Link to={url}>
			<div className="p-3 hover:bg-secondary">
				<h3 className="text-lg">Scrum {number}</h3>
				<p className="text-sm w-full max-h-16 line-clamp-3">
					{title || <span className="italic">Untitled</span>}
				</p>
			</div>
		</Link>
	);
};

export const SCRUM_LIST_KEY = ["scrums", "list"];

export const ScrumSidebar = () => {
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
		<div className="h-full overflow-y-scroll w-80 border-r-primary border-2 bg-white">
			{data.scrums.map((scrum) => (
				<ScrumSidebarItem key={scrum.id} scrum={scrum} />
			))}
		</div>
	);
};
