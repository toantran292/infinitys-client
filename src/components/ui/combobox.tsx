"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputForm } from "@/components/ui/input";

interface ComboboxOption {
    label: string;
    value: string;
    avatar?: string;
}

interface ComboboxProps {
    options: (string | ComboboxOption)[];
    value?: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function Combobox({
    options,
    value,
    onValueChange,
    placeholder = "Chọn một mục...",
    className,
}: ComboboxProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const getOptionLabel = (option: string | ComboboxOption) => {
        return typeof option === "string" ? option : option.label;
    };

    const getOptionValue = (option: string | ComboboxOption) => {
        return typeof option === "string" ? option : option.value;
    };

    const filteredOptions = options?.filter(option =>
        getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Find the selected option to display its label in the input
    React.useEffect(() => {
        if (value) {
            const selectedOption = options?.find(opt => getOptionValue(opt) === value);
            if (selectedOption) {
                setSearchTerm(getOptionLabel(selectedOption));
            }
        }
    }, [value, options]);

    return (
        <div className="relative">
            <div className="relative flex items-center">
                <InputForm
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className={cn(
                        "h-11",
                        value && options?.find(opt => getOptionValue(opt) === value) && typeof options?.find(opt => getOptionValue(opt) === value) !== "string"
                            ? "pl-16"
                            : "pl-10",
                        className
                    )}
                />
                <div className="absolute left-0 flex items-center h-full px-3 gap-1">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    {value && options?.find(opt => getOptionValue(opt) === value) && typeof options?.find(opt => getOptionValue(opt) === value) !== "string" && (
                        <img
                            src={(options?.find(opt => getOptionValue(opt) === value) as ComboboxOption).avatar || "https://github.com/shadcn.png"}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                        />
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                            Không tìm thấy kết quả
                        </div>
                    ) : (
                        <div className="py-1">
                            {filteredOptions.map((option) => (
                                <div
                                    key={getOptionValue(option)}
                                    className={cn(
                                        "px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center gap-2",
                                        value === getOptionValue(option) && "bg-gray-100"
                                    )}
                                    onClick={() => {
                                        onValueChange(getOptionValue(option));
                                        setSearchTerm(getOptionLabel(option));
                                        setIsOpen(false);
                                    }}
                                >
                                    {typeof option !== "string" && (
                                        <img src={option.avatar || "https://github.com/shadcn.png"} alt="" className="w-5 h-5 rounded-full object-cover" />
                                    )}
                                    {getOptionLabel(option)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 