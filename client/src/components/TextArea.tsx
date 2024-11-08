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

	return (
		<textarea
			className={`bg-secondary border-none w-full resize-none focus:ring-0 focus:bg-white ${fontSizeClass}`}
			value={value}
			onChange={(e) => {
				onChange(e.currentTarget.value);
			}}
			placeholder={placeholder}
			rows={1}
		/>
	);
};
