export const COLUMNS = () => [
  {
    Header: '',
    accessor: 'select',
    Cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.original.isSelected}
        onChange={() => row.original.handleRowSelect(row.index)}
      />
    ),
  },
  
  {
    Header: 'Branch Name',
    accessor: 'branchName',
  },
  {
    Header: 'User Name',
    accessor: 'userName',
  },
  {
    Header: 'Phone',
    accessor: 'phone',
    Cell: ({ value }) => (value ? value.toString() : 'N/A'),
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Password',
    accessor: 'password',
  },
  
  
];
