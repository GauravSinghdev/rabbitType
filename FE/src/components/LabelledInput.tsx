import { ChangeEvent } from "react";

interface LabelledInputType {
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    name: string;
}

const LabelledInput = ({ placeholder, onChange, type, name }: LabelledInputType) => {
    return (
        <div>
            <input 
                onChange={onChange} 
                type={type || "text"} 
                id={name}
                name={name} 
                className="bg-[#2d2e30] text-[#d1d0c5] rounded-lg outline-none focus:outline-[#578670fa] p-2 mb-2 w-full placeholder:text-[#656769] text-sm" 
                placeholder={placeholder} 
                required 
                autoComplete="off" 
            />
        </div>
    );
}

export default LabelledInput;
