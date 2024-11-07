import type { ScrumGetResponse } from "@scr4m/common";

type ScrumTabMemberProps = {
	scrum: ScrumGetResponse;
	memberId: number;
};

export const ScrumTabMember = (props: ScrumTabMemberProps) => {
	const { scrum, memberId } = props;

	const member = scrum.members.find((m) => m.id === memberId);
	if (!member) {
		throw new Error(`Invalid member ID ${memberId}`);
	}

	return (
		<div>
			<p>Member {props.memberId}</p>
		</div>
	);
};
