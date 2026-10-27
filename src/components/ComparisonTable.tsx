import SectionHeader from './SectionHeader';
import type { Comparison } from '../config/home';

interface Props {
  comparison: Comparison;
}

export default function ComparisonTable({ comparison }: Props) {
  const last = comparison.columns.length - 1;

  return (
    <section className="home-section band" aria-labelledby="compared">
      <SectionHeader id="compared" title="What Windows already gives you">
        Windows already has two places to keep things. This is how they compare.
      </SectionHeader>
      <table className="compare">
        <thead>
          <tr>
            <td />
            {comparison.columns.map((col, i) => (
              <th key={col} scope="col" className={i === last ? 'is-alcove' : undefined}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row) => (
            <tr key={row.task}>
              <th scope="row">{row.task}</th>
              {row.cells.map((cell, i) => (
                <td
                  key={comparison.columns[i]}
                  data-label={comparison.columns[i]}
                  className={i === last ? 'is-alcove' : undefined}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
