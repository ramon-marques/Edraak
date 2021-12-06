import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const TableHeader = ({ headers, onSorting, setApplications, applications }) => {
  const [sortingField, setSortingField] = useState('');
  const [sortingOrder, setSortingOrder] = useState('asc');

  const onSortingChange = (field) => {
    const order =
      field === sortingField && sortingOrder === 'asc' ? 'desc' : 'asc';

    setSortingField(field);
    setSortingOrder(order);
    onSorting(field, order);
  };

  return (
    <thead>
      <tr>
        <th>
          <input
            type="checkbox"
            onChange={(e) => {
              let value = e.target.checked;
              setApplications(
                applications.map((d) => {
                  d.select = value;
                  return d;
                })
              );
            }}
          />
        </th>
        {headers.map(({ name, field, sortable }) => (
          <th
            key={name}
            onClick={() => (sortable ? onSortingChange(field) : null)}
          >
            {name}

            {sortingField && sortingField === field && (
              <FontAwesomeIcon
                className="mx-2"
                icon={sortingOrder === 'asc' ? faArrowDown : faArrowUp}
              />
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
