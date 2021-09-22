import React from 'react';

export interface TableHeader {}
export interface Props {
  headers: string[];
  rows: Array<{ cells: Array<React.ReactNode> }>;
  columnPercents: string;
}

const TableBase: React.FunctionComponent<Props> = ({
  headers,
  rows,
  columnPercents,
}: Props) => {
  return (
    <div className="w-full px-5 py-4 bg-white rounded-3xl">
      <div className="flex items-center justify-between mb-5">
        <p className="font-semibold text-[1rem]">Holdings</p>
        <p className="font-semibold text-[1rem]">Menu</p>
      </div>

      <div
        style={{ display: 'grid', gap: '1rem', gridTemplateColumns: columnPercents }}
        className="font-semibold text-[.9rem] text-darkgray mb-4"
      >
        {headers.map((header) => (
          <div>{header}</div>
        ))}
      </div>

      <div className="font-manrope">
        {rows.map((row) => (
          <div
            className="border-b border-bordergray"
            style={{ display: 'grid', gap: '1rem', gridTemplateColumns: columnPercents }}
          >
            {row.cells.map((cell) => (
              <div>{cell}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableBase;
