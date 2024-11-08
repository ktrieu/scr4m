import type { ScrumGetResponse } from "@scr4m/common";
import { TextArea } from "../TextArea";

export type ScrumTabMainTitle = {
	scrum: ScrumGetResponse;
};

const ScrumTabMainTitle = (props: ScrumTabMainTitle) => {
	const { scrum } = props;

	return (
		<>
			<h1 className="text-8xl mb-3">Scrum #{scrum.number}</h1>
			<div className="text-2xl">
				<TextArea
					value={scrum.title}
					onChange={() => {}}
					placeholder="Untitled"
					size="large"
					allowNewlines
				/>
			</div>
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
