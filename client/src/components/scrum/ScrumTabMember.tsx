import type {
	ScrumGetEntry,
	ScrumGetMember,
	ScrumGetResponse,
} from "@scr4m/common";
import { TextArea } from "../TextArea";

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

	const rows: Array<[ScrumGetEntry, ScrumGetEntry, ScrumGetEntry]> = [];

	for (let i = 0; i < maxRows; i++) {
		rows.push([
			{
				id: 1,
				body: "TBD",
				order: 1,
			},
			dids[i],
			todos[i],
		]);
	}

	return rows;
};

const ScrumCell = (props: React.PropsWithChildren) => {
	return (
		<div className="px-4 py-2 border-b border-primary">{props.children}</div>
	);
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
				<div className="flex items-center">
					<input
						type="checkbox"
						id="present-checkbox"
						className="mr-3 accent-primary text-primary bg-secondary border-2 border-primary h-6 w-6"
						checked={member.present}
					/>
					<label htmlFor="present-checkbox" className="text-2xl">
						HERE
					</label>
				</div>
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

				{entryRows.map((row) => {
					const [todid, did, todo] = row;

					return (
						<>
							{todid ? (
								<TextArea
									key={`${todid.id}-todid`}
									value="TBD"
									onChange={() => {}}
									size="default"
									disabled
								/>
							) : (
								<div key="none" />
							)}
							{did ? (
								<TextArea
									key={`${did.id}-did`}
									value={did.body}
									onChange={() => {}}
									size="default"
								/>
							) : (
								<div key="none" />
							)}
							{todo ? (
								<TextArea
									key={`${todo.id}-todo`}
									value={todo.body}
									onChange={() => {}}
									size="default"
								/>
							) : (
								<div key="none" />
							)}
						</>
					);
				})}
			</div>
		</>
	);
};
