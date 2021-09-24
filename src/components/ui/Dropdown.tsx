import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Props {
  options: Array<{ label: string; onClick: () => void }>;
  button: () => React.ReactNode;
}

const Dropdown: React.FunctionComponent<Props> = ({ options, button }: Props) => {
  return (
    <Menu as="div" className="relative inline-block">
      <div>
        <Menu.Button>{button}</Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-75"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <Menu.Items className="absolute right-0 w-48 mt-3 origin-top-right bg-white rounded-lg shadow-lg z-50 p-4 space-y-4 border border-lightgray">
          {options.map((opt) => (
            <div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className="text-dark font-semibold text-[0.9rem] w-full text-left hover:text-darkgray"
                    onClick={opt.onClick}
                  >
                    {opt.label}
                  </button>
                )}
              </Menu.Item>
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
