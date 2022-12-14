import { Menu, Transition } from '@headlessui/react';
import { SelectorIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import React, { Fragment } from 'react';

interface Props {
  options: Array<{ value: any; label: string }>;
  selected: string;
  onChange: (selected: string) => void;
  className?: string;
}

const Select: React.FunctionComponent<Props> = ({
  onChange,
  selected,
  className,
  options,
}: Props) => {
  return (
    <Menu>
      <div className={classNames('relative w-full cursor-pointer', className)}>
        <Menu.Button className="relative w-full py-3 pl-3 pr-10 leading-normal text-left bg-white border-2 shadow-sm cursor-pointer rounded-md border-bordergray focus:outline-none hover:bg-light">
          <span className="block font-medium truncate">
            {options.find((opt) => opt.value === selected)?.label ?? ''}
          </span>
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
          <Menu.Items className="absolute z-10 w-full mt-1 overflow-auto bg-white border shadow-lg rounded-md text-md border-bordergray max-h-60 ring-1 ring-bordergray ring-opacity-5 focus:outline-none">
            {options.map((opt, i) => (
              <Menu.Item key={i}>
                {({ active }) => (
                  <div
                    onClick={() => onChange(opt.value)}
                    key={opt.value}
                    className="relative block py-3 pl-3 font-medium border-b select-none pr-9 text-dark border-bordergray hover:bg-lightlime"
                  >
                    {opt.label}
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
