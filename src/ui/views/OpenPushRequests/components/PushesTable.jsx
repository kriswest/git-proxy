import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import styles from '../../../assets/jss/material-dashboard-react/views/dashboardStyle';
import { getPushes } from '../../../services/git-push';
import { KeyboardArrowRight } from '@material-ui/icons';
import Search from '../../../components/Search/Search'; // Import the Search component
import Pagination from '../../../components/Pagination/Pagination';  // Import Pagination component

export default function PushesTable(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const [, setAuth] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState(''); // Define searchTerm state
  const openPush = (push) => navigate(`/admin/push/${push}`, { replace: true });

    
  

  useEffect(() => {
    const query = {};

    for (const k in props) {
      if (!k) continue;
      query[k] = props[k];
    }
    getPushes(setIsLoading, setData, setAuth, setIsError, query);
  }, [props]);



  useEffect(() => {
    // Initialize filtered data with full data on load
    const filtered = filterByStatus(data);
    setFilteredData(filtered);
  }, [props]);

  const filterByStatus = (data) => {
    if (props.authorised) {
      return data.filter(item => item.status === 'approved');
    }
    if (props.rejected) {
      return data.filter(item => item.status === 'rejected');
    }
    if (props.canceled) {
      return data.filter(item => item.status === 'canceled');
    }
    if (props.blocked) {
      return data.filter(item => item.status === 'pending');
    }
    return data;
  };


  // Apply search to the filtered data
  useEffect(() => {
    const filtered = filterByStatus(data); // Apply status filter first
    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const searchFiltered = filtered.filter((item) =>
        item.repo.toLowerCase().includes(lowerCaseTerm) ||
        item.commitTo.toLowerCase().includes(lowerCaseTerm) ||
    
        item.commitData[0].message.toLowerCase().includes(lowerCaseTerm)
      );
      setFilteredData(searchFiltered);
    } else {
      setFilteredData(filtered); // Reset to filtered data after clearing search
    }
    setCurrentPage(1); // Reset pagination on search
  }, [searchTerm, props]); // Trigger on search or tab change

  // Handler function for search input
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm); // Update search term state
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);  // Update current page
  };

   // Logic for pagination (getting items for the current page)
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
 
   // Change page
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong ...</div>;

  return (
    <div>
      <Search onSearch={handleSearch} /> {/* Use the Search component */}

      
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Timestamp</TableCell>
              <TableCell align="left">Repository</TableCell>
              <TableCell align="left">Branch</TableCell>
              <TableCell align="left">Commit SHA</TableCell>
              <TableCell align="left">Committer</TableCell>
              <TableCell align="left">Author</TableCell>
              <TableCell align="left">Author E-mail</TableCell>
              <TableCell align="left">Commit Message</TableCell>
              <TableCell align="left">No. of Commits</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.reverse().map((row) => {
              const repoFullName = row.repo.replace('.git', '');
              const repoBranch = row.branch.replace('refs/heads/', '');

              return (
                <TableRow key={row.id}>
                  <TableCell align="left">
                    {moment
                      .unix(row.commitData[0].commitTs || row.commitData[0].commitTimestamp)
                      .toString()}
                  </TableCell>
                  <TableCell align="left">
                    <a href={`https://github.com/${row.repo}`} rel="noreferrer" target="_blank">
                      {repoFullName}
                    </a>
                  </TableCell>
                  <TableCell align="left">
                    <a
                      href={`https://github.com/${repoFullName}/tree/${repoBranch}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {repoBranch}
                    </a>
                  </TableCell>
                  <TableCell align="left">
                    <a
                      href={`https://github.com/${repoFullName}/commit/${row.commitTo}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {row.commitTo.substring(0, 8)}
                    </a>
                  </TableCell>
                  <TableCell align="left">
                    <a
                      href={`https://github.com/${row.commitData[0].committer}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {row.commitData[0].committer}
                    </a>
                  </TableCell>
                  <TableCell align="left">
                    <a
                      href={`https://github.com/${row.commitData[0].author}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {row.commitData[0].author}
                    </a>
                  </TableCell>
                  <TableCell align="left">
                    {row.commitData[0].authorEmail ? (
                      <a href={`mailto:${row.commitData[0].authorEmail}`}>
                        {row.commitData[0].authorEmail}
                      </a>
                    ) : (
                      'No data...'
                    )}
                  </TableCell>
                  <TableCell align="left">{row.commitData[0].message}</TableCell>
                  <TableCell align="left">{row.commitData.length}</TableCell>
                  <TableCell component="th" scope="row">
                    <Button variant="contained" color="primary" onClick={() => openPush(row.id)}>
                      <KeyboardArrowRight />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
  {/* Pagination Component */}
  <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredData.length}
        paginate={paginate}
        currentPage={currentPage}
        onPageChange={handlePageChange} 
      />
    </div>
  );
}




