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

const ScrumCell = (props: React.PropsWithChildren) => {
	return <p className="px-4 py-2 border-b border-primary">{props.children}</p>;
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
			<div className="grid grid-cols-3 gap-x-6">
				<ScrumCell>
					<h1 className="text-center text-4xl mb-6">TODIDS</h1>
				</ScrumCell>
				<ScrumCell>
					<h1 className="text-center text-4xl mb-6">DIDS</h1>
				</ScrumCell>
				<ScrumCell>
					<h1 className="text-center text-4xl mb-6">TODOS</h1>
				</ScrumCell>

				{entryRows.map((row, i) => {
					const [todid, did, todo] = row;

					return (
						<>
							<ScrumCell key={`${i}-todid`}>{todid}</ScrumCell>
							<ScrumCell key={`${i}-did`}>{did}</ScrumCell>
							<ScrumCell key={`${i}-todo`}>{todo}</ScrumCell>
						</>
					);
				})}
			</div>
		</>
	);
};
