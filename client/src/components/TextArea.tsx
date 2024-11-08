import { useEffect, useRef } from "react";

export type TextAreaSize = "large" | "default";

type TextAreaProps = {
	value: string;
	size: TextAreaSize;
	onChange: (value: string) => void;
	placeholder?: string;
};

const getFontSizeClass = (size: TextAreaSize) => {
	switch (size) {
		case "large":
			return "text-2xl";
		case "default":
			return "";
	}
};

export const TextArea = (props: TextAreaProps) => {
	const { value, onChange, placeholder, size } = props;

	const fontSizeClass = getFontSizeClass(size);

	const ref = useRef<HTMLTextAreaElement | null>(null);

	// Clever trick to autosize the textarea from here: https://medium.com/@oherterich/creating-a-textarea-with-dynamic-height-using-react-and-typescript-5ed2d78d9848
	// biome-ignore lint/correctness/useExhaustiveDependencies: We need to recalc height when the value changes, even if we don't use it.
	useEffect(() => {
		const { current: textArea } = ref;
		if (textArea) {
			textArea.style.height = "0px";
			const scrollHeight = textArea.scrollHeight;

			textArea.style.height = `${scrollHeight}px`;
		}
	}, [ref, value]);

	return (
		<textarea
			className={`bg-secondary border-none w-full resize-none focus:ring-0 focus:bg-white ${fontSizeClass}`}
			ref={ref}
			value={value}
			onChange={(e) => {
				onChange(e.currentTarget.value);
			}}
			placeholder={placeholder}
			rows={1}
		/>
	);
};
