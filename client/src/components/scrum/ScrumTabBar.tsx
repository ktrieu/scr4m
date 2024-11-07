import type { ScrumGetResponse } from "@scr4m/common";

export type MainScrumTabState = {
	type: "main";
};

export type MemberScrumTabState = {
	type: "member";
	id: number;
};

export type ScrumTabState = MainScrumTabState | MemberScrumTabState;

type ScrumTabBarItemProps = {
	onClick: () => void;
	selected: boolean;
};

const ScrumTabBarItem = (
	props: React.PropsWithChildren<ScrumTabBarItemProps>,
) => {
	const { children, onClick, selected } = props;

	return (
		<button
			type="button"
			onClick={onClick}
			className={`w-16 h-full hover:bg-secondary ${selected && "bg-secondary"}`}
		>
			{children}
		</button>
	);
};

type ScrumTabBarProps = {
	scrum: ScrumGetResponse;
	state: ScrumTabState;
	changeTab: (newState: ScrumTabState) => void;
};

export const ScrumTabBar = (props: ScrumTabBarProps) => {
	const { changeTab, state, scrum } = props;
	return (
		<div className="w-full bg-white border-t-2 border-primary h-14">
			<ScrumTabBarItem
				onClick={() => {
					changeTab({ type: "main" });
				}}
				selected={state.type === "main"}
			>
				🏠
			</ScrumTabBarItem>
			{scrum.members.map((m) => (
				<ScrumTabBarItem
					onClick={() => {
						changeTab({ type: "member", id: m.id });
					}}
					selected={state.type === "member" && state.id === m.id}
					key={m.id}
				>
					{m.name.charAt(0).toUpperCase()}
				</ScrumTabBarItem>
			))}
		</div>
	);
};
