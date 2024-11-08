type TextAreaProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
};

export const TextArea = (props: TextAreaProps) => {
	const { value, onChange, placeholder } = props;

	return (
		<textarea
			className="text-2xl bg-secondary border-none w-full resize-none focus:ring-0 focus:bg-white"
			value={value}
			onChange={(e) => {
				onChange(e.currentTarget.value);
			}}
			placeholder={placeholder}
			rows={1}
		/>
	);
};
