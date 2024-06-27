import logoUrl from "@public/logo.svg";

export const Logo = () => {
	return (
		<div className="flex justify-start h-24 items-center gap-4 p-4">
			<img src={logoUrl} className="h-full" alt="UGO II logo." />
			<h1 className="text-2xl">SCRUM</h1>
		</div>
	);
};
