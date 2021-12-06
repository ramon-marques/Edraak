import React from 'react';

const Datatable = (props) => {
  const columns = props.data[0] && Object.keys(props.data[0]);
  return (
    <table cellPadding={0} cellSpacing={0}>
      <thead>
        <tr>{props.data[0] && columns.map((heading) => <th>{heading}</th>)}</tr>
      </thead>
      <tbody>
        {props.data.map((row) => (
          <tr>
            {columns.map((column) => (
              <td>{row[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Datatable;
