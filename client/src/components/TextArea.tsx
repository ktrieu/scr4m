import { useRef, useState, useEffect } from "react";

type TextAreaSize = "large" | "default";

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
	const [localValue, setLocalValue] = useState<string>(value);

	const isSubmitting = useRef<boolean>(false);

	// Clever trick to autosize the textarea from here: https://medium.com/@oherterich/creating-a-textarea-with-dynamic-height-using-react-and-typescript-5ed2d78d9848
	// biome-ignore lint/correctness/useExhaustiveDependencies: We need to recalc height when the value changes, even if we don't use it.
	useEffect(() => {
		const { current: textArea } = ref;
		if (textArea) {
			textArea.style.height = "0px";
			const scrollHeight = textArea.scrollHeight;

			textArea.style.height = `${scrollHeight}px`;
		}
	}, [ref, value, localValue]);

	const insertNewline = () => {
		setLocalValue((value) => `${value}\n`);
	};

	const submit = () => {
		onChange(localValue);
		isSubmitting.current = true;
		ref.current?.blur();
	};

	const reset = () => {
		setLocalValue(value);
	};

	const onEnterKeyPressed = (e: React.KeyboardEvent) => {
		if (e.shiftKey) {
			insertNewline();
		} else {
			submit();
		}
	};

	return (
		<textarea
			className={`bg-secondary border-none w-full resize-none focus:ring-0 focus:bg-white ${fontSizeClass}`}
			ref={ref}
			value={localValue}
			onChange={(e) => {
				setLocalValue(e.currentTarget.value);
			}}
			onBlur={() => {
				if (!isSubmitting.current) {
					reset();
				}
				isSubmitting.current = false;
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					onEnterKeyPressed(e);
				}
			}}
			placeholder={placeholder}
			rows={1}
		/>
	);
};
