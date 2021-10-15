import { Menu, Transition } from '@headlessui/react';
import { SelectorIcon } from '@heroicons/react/outline';
import React, { Fragment } from 'react';

interface Props {
  options: Array<string>;
  selected: string;
  onChange: (selected: string) => void;
}

const Select: React.FunctionComponent<Props> = ({ onChange, selected, options }: Props) => {
  return (
    <Menu>
      <div className="relative w-full cursor-pointer">
        <Menu.Button className="relative w-full py-3 pl-3 pr-10 leading-normal text-left bg-white border rounded-md shadow-sm cursor-pointer border-bordergray focus:outline-none hover:bg-light">
          <span className="block font-medium truncate">{selected}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon className="w-5 h-5" aria-hidden="true" />
          </span>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition duration-200 ease-out"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100"
          leave="transition duration-200 ease-out"
          leaveFrom="opacity-100"
          leaveTo="-translate-y-2 opacity-0"
        >
          <Menu.Items className="absolute z-10 w-full mt-1 overflow-auto bg-white border rounded-md shadow-lg text-md border-bordergray max-h-60 ring-1 ring-bordergray ring-opacity-5 focus:outline-none">
            {options.map((opt) => (
              <Menu.Item key={opt}>
                {({ active }) => (
                  <div
                    onClick={() => onChange(opt)}
                    key={opt}
                    className="relative block py-3 pl-3 font-medium border-b select-none pr-9 text-dark border-bordergray hover:bg-lightlime"
                  >
                    {opt}
                  </div>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};

export default Select;
