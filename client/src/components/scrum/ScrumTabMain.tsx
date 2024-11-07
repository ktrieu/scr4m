import type { ScrumGetResponse } from "@scr4m/common";

export type ScrumTabMainTitle = {
	scrum: ScrumGetResponse;
};

const ScrumTabMainTitle = (props: ScrumTabMainTitle) => {
	const { scrum } = props;

	return (
		<>
			<h1 className="text-8xl mb-3">Scrum #{scrum.number}</h1>
			<p className="text-xl">
				{scrum.title || <span className="italic">Untitled</span>}
			</p>{" "}
		</>
	);
};

type ScrumTabMainProps = {
	scrum: ScrumGetResponse;
};

export const ScrumTabMain = (props: ScrumTabMainProps) => {
	const { scrum } = props;
	return <ScrumTabMainTitle scrum={scrum} />;
};
