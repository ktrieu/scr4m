import type { ReactNode } from "react";

type ScrumTitleProps = {
	title: string;
};

export const ScrumTitle = (props: ScrumTitleProps) => {
	if (!props.title) {
		return <span className="italic">Untitled</span>;
	}

	const lines = props.title.split("\n");

	const elems: ReactNode[] = [];
	lines.forEach((l, idx) => {
		elems.push(l);
		if (idx !== lines.length - 1) {
			elems.push(<br />);
		}
	});

	return <span>{elems}</span>;
};
