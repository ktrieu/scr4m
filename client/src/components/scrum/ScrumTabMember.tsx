import type { ScrumGetMember, ScrumGetResponse } from "@scr4m/common";

type ScrumTabMemberProps = {
	scrum: ScrumGetResponse;
	memberId: number;
};

const max = (a: number, b: number) => {
	return a < b ? b : a;
};

const reshapeEntries = (member: ScrumGetMember) => {
	const { todos, dids } = member;
	const maxRows = max(todos.length, dids.length);

	const rows: Array<[string, string, string]> = [];

	for (let i = 0; i < maxRows; i++) {
		rows.push(["TBD", dids[i], todos[i]]);
	}

	return rows;
};

export const ScrumTabMember = (props: ScrumTabMemberProps) => {
	const { scrum, memberId } = props;

	const member = scrum.members.find((m) => m.id === memberId);
	if (!member) {
		throw new Error(`Invalid member ID ${memberId}`);
	}

	const entryRows = reshapeEntries(member);

	return (
		<>
			<div className="mb-12">
				<h1 className="text-8xl mb-3">{member.name}</h1>
				<input
					type="checkbox"
					id="present-checkbox"
					className="mr-3 accent-primary"
					checked={member.present}
				/>
				<label htmlFor="present-checkbox" className="text-xl">
					HERE
				</label>
			</div>
			<div className="grid grid-cols-3 gap-4">
				<h1 className="text-center text-xl">TODIDS</h1>
				<h1 className="text-center text-xl">DIDS</h1>
				<h1 className="text-center text-xl">TODOS</h1>
				{entryRows.map((row, i) => {
					const [todid, did, todo] = row;

					return (
						<>
							<p key={`${i}-todid`}>{todid}</p>
							<p key={`${i}-did`}>{did}</p>
							<p key={`${i}-todo`}>{todo}</p>
						</>
					);
				})}
			</div>
		</>
	);
};
