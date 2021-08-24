const StockRow = ({ stock }) => {
  return (
    <tr className="transition-colors bg-white shadow-sm cursor-pointer hover:bg-blue0">
      <td className="px-6 py-3 tracking-wider text-left truncate text-blue1 rounded-bl-md rounded-tl-md">
        <div className="text-sm font-bold">{stock.symbol}</div>
        <div className="w-40 text-sm font-medium text-left truncate text-purple2">
          {stock.fullName}
        </div>
      </td>
      <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
        ${stock.last}
      </td>
      <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
        ${stock.marketValue}
      </td>
      <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
        ${stock.marketValue}%
      </td>
      <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
        <i className="align-middle fas fa-sort-up"></i>
        {stock.dayChange}%
      </td>
      <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
        ${stock.costBasis}
      </td>
      <td className="px-6 py-3 tracking-wider text-left rounded-br-md rounded-tr-md text-blue1">
        <i className="fas fa-sort-up"></i>${stock.gainLoss}
      </td>
    </tr>
  );
};

export default StockRow;
