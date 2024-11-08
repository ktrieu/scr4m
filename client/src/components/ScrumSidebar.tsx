import { type ScrumListObject, ScrumListReturnSchema } from "@scr4m/common";
import { useQuery } from "@tanstack/react-query";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { apiGet } from "../api";
import { ScrumTitle } from "./scrum/ScrumTitle";

type ScrumSidebarItemProps = {
	scrum: ScrumListObject;
	selected: boolean;
};

const formatScrumDate = (scrumDateStr: string) => {
	// TODO: Maybe download a real date library and regularize this,
	const date = new Date(scrumDateStr);
	return date.toLocaleDateString();
};

const ScrumSidebarItem = (props: ScrumSidebarItemProps) => {
	const { title, number, submittedAt } = props.scrum;
	const { selected } = props;

	return (
		<Link to="/scrums/$number" params={{ number: number.toString() }}>
			<div className={`p-3 hover:bg-secondary ${selected && "bg-secondary"}`}>
				<div className="flex justify-between align-bottom">
					<h3 className="text-lg mb-0">#{number}</h3>
					<p className="text-sm mb-0">{formatScrumDate(submittedAt)}</p>
				</div>
				<p className="text-sm w-full max-h-16 line-clamp-3">
					<ScrumTitle title={title} />
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

	const matchRoute = useMatchRoute();

	return (
		<div className="h-full overflow-y-scroll w-80 border-r-primary border-r-2 bg-white">
			{data.scrums.map((scrum) => {
				const match = matchRoute({
					to: "/scrums/$number",
					params: { number: scrum.number.toString() },
				});
				const selected = match !== false;
				return (
					<ScrumSidebarItem key={scrum.id} scrum={scrum} selected={selected} />
				);
			})}
		</div>
	);
};
