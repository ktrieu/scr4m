import { ScrumGetResponseSchema } from "@scr4m/common";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { apiGet } from "../api";
import { ScrumLayout } from "../components/layout/ScrumLayout";
import {
	ScrumTabBar,
	type ScrumTabState,
} from "../components/scrum/ScrumTabBar";
import { ScrumTabMain } from "../components/scrum/ScrumTabMain";
import { ScrumTabMember } from "../components/scrum/ScrumTabMember";

const getScrumFetchKey = (scrumNumber: string) => {
	return ["scrums", "get", scrumNumber];
};

const ScrumsRoute = () => {
	const { number } = Route.useParams();

	const { data } = useQuery({
		initialData: null,
		queryKey: getScrumFetchKey(number),
		queryFn: async () => {
			const response = await apiGet(`/api/scrums/${number}`);
			return ScrumGetResponseSchema.parse(response);
		},
	});

	const [tabState, setTabState] = useState<ScrumTabState>({
		type: "main",
	});

	if (data === null) {
		return (
			<ScrumLayout>
				<h1>Loading...</h1>
			</ScrumLayout>
		);
	}

	const renderTab = (tabState: ScrumTabState) => {
		switch (tabState.type) {
			case "main":
				return <ScrumTabMain scrum={data} />;
			case "member":
				return <ScrumTabMember scrum={data} memberId={tabState.id} />;
		}
	};

	return (
		<ScrumLayout>
			<div className="flex flex-col items-stretch h-full max-h-full">
				<div className="flex-1 p-12 overflow-y-scroll">
					{renderTab(tabState)}
				</div>
				<ScrumTabBar scrum={data} state={tabState} changeTab={setTabState} />
			</div>
		</ScrumLayout>
	);
};

export const Route = createFileRoute("/scrums/$number")({
	component: ScrumsRoute,
});
