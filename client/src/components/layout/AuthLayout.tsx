import type React from "react";
import { Logo } from "./Logo";

type AuthLayoutProps = {
	children: React.ReactNode;
};

export const AuthLayout = (props: AuthLayoutProps) => {
	return (
		<div className="mx-auto flex flex-col justify-center items-center w-1/3 min-w-36 h-full">
			<div className="flex flex-col h-fit items-center border-primary border-2 rounded-sm p-16 bg-gray-200 drop-shadow-lg w-1/2">
				<Logo />
				{props.children}
			</div>
		</div>
	);
};
