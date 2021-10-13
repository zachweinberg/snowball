import { Listbox, Transition } from '@headlessui/react';
import { SelectorIcon } from '@heroicons/react/outline';
import React, { Fragment } from 'react';

interface Props {
  options: Array<string>;
  selected: string;
  onChange: (selected: string) => void;
}

const Select: React.FunctionComponent<Props> = ({ onChange, selected, options }: Props) => {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative w-full cursor-pointer">
        <Listbox.Button className="relative w-full py-4 pl-3 pr-10 leading-normal text-left bg-white border rounded-md shadow-sm cursor-pointer border-bordergray focus:outline-none hover:bg-light">
          <span className="block font-medium truncate">{selected}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon className="w-5 h-5" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 w-full mt-1 overflow-auto bg-white border rounded-md shadow-lg text-md border-bordergray max-h-60 ring-1 ring-bordergray ring-opacity-5 focus:outline-none">
            {options.map((opt) => (
              <Listbox.Option
                key={opt}
                className="relative py-3 pl-3 border-b select-none pr-9 text-dark hover:bg-light border-bordergray"
                value={opt}
              >
                <span className="block font-medium">{opt}</span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default Select;
