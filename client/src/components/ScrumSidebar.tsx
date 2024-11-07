import { type ScrumListObject, ScrumListReturnSchema } from "@scr4m/common";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { apiGet } from "../api";

type ScrumSidebarItemProps = {
	scrum: ScrumListObject;
};

const formatScrumDate = (scrumDateStr: string) => {
	// TODO: Maybe download a real date library and regularize this,
	const date = new Date(scrumDateStr);
	return date.toLocaleDateString();
};

const ScrumSidebarItem = (props: ScrumSidebarItemProps) => {
	const { title, number, submittedAt } = props.scrum;

	const url = `/scrums/${number}`;

	return (
		<Link to={url}>
			<div className="p-3 hover:bg-secondary">
				<div className="flex justify-between align-bottom">
					<h3 className="text-lg mb-0">#{number}</h3>
					<p className="text-sm mb-0">{formatScrumDate(submittedAt)}</p>
				</div>
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
		<div className="h-full overflow-y-scroll w-80 border-r-primary border-r-2 bg-white">
			{data.scrums.map((scrum) => (
				<ScrumSidebarItem key={scrum.id} scrum={scrum} />
			))}
		</div>
	);
};
