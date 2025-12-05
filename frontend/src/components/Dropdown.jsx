import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({ label, value, options, onChange }) {
  return (
    <div className="relative w-[140px]">
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          
          {/* Button */}
          <Listbox.Button
            className="w-full bg-white text-sm px-3 py-2 rounded border
                       hover:border-gray-400 transition flex justify-between items-center"
          >
            {label || value}
            <ChevronDown size={16} />
          </Listbox.Button>

          {/* Dropdown Menu */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className="absolute mt-2 w-full rounded-lg bg-white shadow-lg 
                         text-sm py-2 z-40 border border-gray-200"
            >
              {options.map((opt, idx) => (
                <Listbox.Option
                  key={idx}
                  value={opt}
                  className={({ active }) =>
                    `cursor-pointer px-3 py-2 rounded ${
                      active ? "bg-gray-100" : ""
                    }`
                  }
                >
                  {opt}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>

        </div>
      </Listbox>
    </div>
  );
}
