import type { CSSProperties, ReactNode } from 'react';

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  rows: Record<string, unknown>[];
  striped?: boolean;
  bordered?: boolean;
  stickyHeader?: boolean;
  emptyMessage?: string;
  className?: string;
  style?: CSSProperties;
}

export function Table({
  columns,
  rows,
  striped,
  bordered,
  stickyHeader,
  emptyMessage = 'No data available',
  className,
  style,
}: TableProps) {
  return (
    <div
      className={['w-full overflow-x-auto rounded-lg', bordered ? 'border border-gray-200' : '', className ?? ''].filter(Boolean).join(' ')}
      style={style}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={['bg-gray-50', stickyHeader ? 'sticky top-0 z-10' : ''].filter(Boolean).join(' ')}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={[
                  'transition-colors hover:bg-gray-50',
                  striped && rowIndex % 2 === 1 ? 'bg-gray-50/60' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
