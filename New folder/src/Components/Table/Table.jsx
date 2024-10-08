import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import { COLUMNS } from "./columns";
import MOCK_DATA from "./MOCK_DATA.json";
import GoogleMapComponent from "../googlemap/googlemap.jsx";
import { Cards } from "../Cards/Cards.jsx";
import * as XLSX from "xlsx";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  keyframes,
} from "@mui/material";
import IndividualGooglemap from "../googlemap/IndividualGooglemap/IndividualGooglemap.jsx";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto", // Enable vertical scrolling
  display: "flex",
  flexDirection: "column",
};

export const Tablee = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState("");
  const [filteredRows, setFilteredRows] = useState(
    MOCK_DATA.map((row) => ({ ...row, isSelected: false }))
  );
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(COLUMNS.map((col) => [col.accessor, true]))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [vehicleRunningCount, setVehicleRunningCount] = useState(0);
  const [vehicleStoppedCount, setVehicleStoppedCount] = useState(0);
  const [vehicleOverspeedCount, setVehicleOverspeedCount] = useState(0);
  const [vehicleIdleCount, setVehicleIdleCount] = useState(0);
  const [, set] = useState(0);
  const [apiData, setAPIData] = useState([]);
  const [assetDetailsModalOpen, setAssetDetailsModalOpen] = useState(false);
  const [assetStatusValue, setAssetStatusValue] = useState("");
  const [assetsValue, setAssetsValue] = useState("");
  const [usersValue, setUsersValue] = useState("");
  const [groupsValue, setGroupsValue] = useState("");
  const [areasValue, setAreasValue] = useState("");
  const [landmarksValue, setLandmarksValue] = useState("");
  const [vehiclesValue, setVehiclesValue] = useState("");
  const [totDist, setTotDist] = useState(0);
  const [attributes1, setAttributes1] = useState("");
  const [latitude, setLatitude] = useState([]);
  const [longitude, setLongitude] = useState([]);
  const [addressesValue, setAddressesValue] = useState();

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [lati, setLati] = useState(0);
  const [longi, setLongi] = useState(0);
  const [individualMap, setIndividualMap] = useState(false);

  useEffect(() => {
    setFilteredRows(data.map((row) => ({ ...row, isSelected: false })));
  }, [data]);

  useEffect(() => {
    setLatitude(data.map((row) => row.latitude));
    // console.log(latitude); console.log(latitude[0]);
  }, [data]);

  useEffect(() => {
    setLongitude(data.map((row) => row.longitude));
    //  console.log(longitude);
  }, [data]);

  useEffect(() => {
    // console.log(filteredRows);
    // for (let i = 0; i < filteredRows.length; i++) {
    //   let row = filteredRows[i];
    //   if (row.hasOwnProperty('attributes')) {
    //     for (let key in row.attributes) {
    //       if (key === 'totalDistance') {
    //         console.log(row.attributes[key]);
    //         // COLUMNS(row.attributes[key])
    //       } else {
    //         console.log('');
    //       }
    //     }
    //   }
    // }
  }, [filteredRows]);

  useEffect(() => {
    const getAddressFromLatLng = async (lat, lng) => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC30e6tiNsE_rn2YY8kfPFfNPZxG3YlOu4`
        );
        const address = response.data.results[0].formatted_address;
        // console.log(`Latitude: ${lat}, Longitude: ${lng}, Address: ${address}`);
        return address;
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // console.error("Error - Response Data:", error.response.data);
          // console.error("Error - Response Status:", error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          // console.error("Error - No Response:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.error("Error - Request Setup:", error.message);
        }
        return null;
      }
    };

    const fetchAddresses = async () => {
      const addresses = await Promise.all(
        data.map(async (row) => {
          const address = await getAddressFromLatLng(
            row.latitude,
            row.longitude
          );
          // console.log('lat long value',row.latitude, row.longitude)
          return { ...row, address };
        })
      );
      setAddressesValue(addresses);
      console.log(addresses);
    };

    fetchAddresses();
  }, [data]);

  useEffect(() => {
    filterData(filterText);
  }, [filterText]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    const text = event.target.value;
    setFilterText(text);
  };

  const filterData = (text) => {
    const filteredData = MOCK_DATA.filter((row) =>
      Object.values(row).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(text.toLowerCase())
      )
    ).map((row) => ({ ...row, isSelected: false }));
    setFilteredRows(filteredData);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleVehicleClick = () => {
    setAssetDetailsModalOpen(true);
  };

  const handleLocationClick = (latitude, longitude) => {
    // <div style={{ height: '500px', width: '100%' }}>
    //   <iframe
    //     src={`https://maps.google.com/maps?q=${latitude[1]},${longitude[1]}&z=${zoom}&output=embed`}
    //     style={{ border: 0, height: '100%', width: '100%' }}
    //     allowFullScreen
    //     loading="lazy"
    //     referrerPolicy="no-referrer-when-downgrade"
    //     title="google map"
    //   ></iframe>
    // </div>
    setLati(latitude);
    setLongi(longitude);
  };

  const handleExport = () => {
    const dataToExport = filteredRows.map((row) => {
      const { isSelected, ...rowData } = row;
      return rowData;
    });
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Dashboard.xlsx");
  };

  const handleColumnVisibilityChange = (accessor) => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      [accessor]: !prevState[accessor],
    }));
  };

  const handleRowSelect = (index) => {
    const newFilteredRows = [...filteredRows];
    newFilteredRows[index].isSelected = !newFilteredRows[index].isSelected;
    setFilteredRows(newFilteredRows);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    const newFilteredRows = filteredRows.map((row) => ({
      ...row,
      isSelected: newSelectAll,
    }));
    setFilteredRows(newFilteredRows);
    setSelectAll(newSelectAll);
  };

  const sortedData = [...filteredRows];
  if (sortConfig.key !== null) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  const columns = COLUMNS.map((col) => ({
    ...col,
    Cell:
      col.accessor === "select"
        ? ({ row }) => (
            <input
              type="checkbox"
              checked={row.original.isSelected}
              onChange={() => handleRowSelect(row.index)}
            />
          )
        : col.Cell,
  }));

  return (
    <>
      <div style={{ marginTop: "75px" }}>
        <div style={{ display: "flex", gap: "16px",marginTop:'98px' }}>
          <FormControl
            variant="outlined"
            fullWidth
            sx={{ width: 250, "& .MuiInputBase-root": { height: 40 } }}
          >
            <InputLabel id="asset-status-label-1">Asset Status</InputLabel>
            <Select
              labelId="asset-status-label-1"
              id="asset-status-select-1"
              value={assetStatusValue}
              onChange={(e) => setAssetStatusValue(e.target.value)}
              label="Select Asset Status"
            >
              <MenuItem value="All assets">All assets</MenuItem>
              <MenuItem value="Running">Running</MenuItem>
              <MenuItem value="Parked">Parked</MenuItem>
              <MenuItem value="less than 10km">Less than 10km</MenuItem>
              <MenuItem value="Out of Network">Out of Network</MenuItem>
              <MenuItem value="Device Fault">Device Fault</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            fullWidth
            sx={{ width: 250, "& .MuiInputBase-root": { height: 40 } }}
          >
            <InputLabel id="asset-status-label-2">Assets</InputLabel>
            <Select
              labelId="assets-label-2"
              id="assets-select-2"
              value={assetsValue}
              onChange={(e) => setAssetsValue(e.target.value)}
              label="Select Assets"
            >
              {/* Add your asset options here */}
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            fullWidth
            sx={{ width: 250, "& .MuiInputBase-root": { height: 40 } }}
          >
            <InputLabel id="users-label-3">Users</InputLabel>
            <Select
              labelId="users-label-3"
              id="users-select-3"
              value={usersValue}
              onChange={(e) => setUsersValue(e.target.value)}
              label="Select Users"
            >
              <MenuItem value="All users">All users</MenuItem>
              <MenuItem value="ankur(Ankur Jain)">ankur(Ankur Jain)</MenuItem>
              <MenuItem value="ashwini(Ashwini Gaikwad)">
                ashwini(Ashwini Gaikwad)
              </MenuItem>
              <MenuItem value="harshal(harshal harshal)">
                harshal(harshal harshal)
              </MenuItem>
              <MenuItem value="Harshal 123 (HARSHAL CREDANCE)">
                Harshal 123 (HARSHAL CREDANCE)
              </MenuItem>
              <MenuItem value="josh(josh JOSH)">josh(josh JOSH)</MenuItem>
              <MenuItem value="vts(CGS Company)">vts(CGS Company)</MenuItem>
              <MenuItem value="vtsdemo1 (chate global services)">
                vtsdemo1 (chate global services)
              </MenuItem>
              <MenuItem value="wcldemo(wcl wcl)">wcldemo(wcl wcl)</MenuItem>
              {/* Add your user options here */}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            fullWidth
            sx={{ width: 250, "& .MuiInputBase-root": { height: 40 } }}
          >
            <InputLabel id="groups-label-4" style={{ alignItems: "center" }}>
              Groups
            </InputLabel>
            <Select
              labelId="groups-label-4"
              id="groups-select-4"
              value={groupsValue}
              onChange={(e) => setGroupsValue(e.target.value)}
              label="Select Groups"
            >
              <MenuItem value="All Group">All Group</MenuItem>
              <MenuItem value="Ankur asset">Ankur asset</MenuItem>
              {/* Add your group options here */}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            fullWidth
            sx={{ width: 250, "& .MuiInputBase-root": { height: 40 } }}
          >
            <InputLabel id="areas-label-5">Areas</InputLabel>
            <Select
              labelId="areas-label-5"
              id="areas-select-5"
              value={areasValue}
              onChange={(e) => setAreasValue(e.target.value)}
              label="Select Areas"
            >
              <MenuItem value="All Areas">All Areas</MenuItem>
              <MenuItem value="amanora">amanora</MenuItem>
              <MenuItem value="Ram Nager">Ram Nager</MenuItem>
              {/* Add your area options here */}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            fullWidth
            sx={{ width: 250, "& .MuiInputBase-root": { height: 40 } }}
          >
            <InputLabel id="landmarks-label-6">Landmarks</InputLabel>
            <Select
              labelId="landmarks-label-6"
              id="landmarks-select-6"
              value={landmarksValue}
              onChange={(e) => setLandmarksValue(e.target.value)}
              label="Select Landmarks"
            >
              <MenuItem value="All Landmarks">All Landmarks</MenuItem>
              <MenuItem value="API Corner">API Corner</MenuItem>
              <MenuItem value="LOADING POINT">LOADING POINT</MenuItem>
              <MenuItem value="Shivneri Lawns">Shivneri Lawns</MenuItem>
              <MenuItem value="UNLOADING POINT">UNLOADING POINT</MenuItem>
              <MenuItem value="weighing bridge">weighing bridge</MenuItem>
              <MenuItem value="yashwant nagar">yashwant nagar</MenuItem>
              {/* Add your landmark options here */}
            </Select>
          </FormControl>
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "right" }}>
          <FormControl
            variant="outlined"
            fullWidth
            sx={{
              width: 250,
              "& .MuiInputBase-root": { height: 40 },
              marginBottom: 2,
            }}
          >
            <InputLabel id="vehicles-label-6">Select Vehicles</InputLabel>
            <Select
              labelId="vehicles-label-6"
              id="vehicles-select-6"
              value={vehiclesValue}
              onChange={(e) => setVehiclesValue(e.target.value)}
              label="Select Asset Status"
            >
              <MenuItem value="MH40BL3039-BESA">MH40BL3039-BESA</MenuItem>
              <MenuItem value="MH40AT0461-HANSA">MH40AT0461-HANSA</MenuItem>
              <MenuItem value="MH04CU9077">MH04CU9077</MenuItem>
              <MenuItem value="MH34BG5552">MH34BG5552</MenuItem>
              <MenuItem value="MH31FC2330">MH31FC2330</MenuItem>
              <MenuItem value="MH31FC1100">MH31FC1100</MenuItem>
              <MenuItem value="MH31-EQ0455">MH31-EQ0455</MenuItem>
              <MenuItem value="Mixer">Mixer</MenuItem>
              <MenuItem value="MH29M8497-HANSA">MH29M8497-HANSA</MenuItem>

              {/* Add your landmark options here */}
            </Select>
          </FormControl>
        </div>

        {/* GoogleMaps */}
        {individualMap ? (
          <IndividualGooglemap setIndividualMap = {setIndividualMap} />
        ) : (
          <GoogleMapComponent lati={latitude} longi={longitude} />
        )}

        <br />
      </div>
      <Cards
        vehicleRunningCount={vehicleRunningCount}
        vehicleStoppedCount={vehicleStoppedCount}
        vehicleOverspeedCount={vehicleOverspeedCount}
        vehicleIdleCount={vehicleIdleCount}
        ={}
      />
      <br />

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            value={filterText}
            onChange={handleFilterChange}
            sx={{
              marginRight: "10px",
              width: "200px",
              "& .MuiInputBase-root": { height: 40 },
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  style={{
                    cursor: "pointer",
                    marginLeft: "10px",
                    marginRight: "5px",
                  }}
                />
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
            sx={{
              backgroundColor: "#2c3e50",
              "&:hover": {
                backgroundColor: "#1a242f",
              },
            }}
          >
            Manage Columns
          </Button>
        </div>

        <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "16px" }}>
          <TableContainer sx={{ maxHeight: "100%" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    key="select-all"
                    align="left"
                    style={{
                      minWidth: 50,
                      borderRight: "1px solid #ddd",
                      backgroundColor: "#2c3e50",
                      color: "white",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {columns.map(
                    (column) =>
                      column.accessor !== "select" &&
                      columnVisibility[column.accessor] && (
                        <TableCell
                          key={column.Header}
                          align={
                            column.accessor === "date_of_birth"
                              ? "right"
                              : "left"
                          }
                          style={{
                            minWidth: column.minWidth,
                            borderRight: "1px solid #ddd",
                            backgroundColor: "#2c3e50",
                            color: "white",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => requestSort(column.accessor)}
                          >
                            {column.Header}
                            <ArrowUpwardIcon
                              style={{
                                width: "10px",
                                color:
                                  sortConfig.key === column.accessor &&
                                  sortConfig.direction === "ascending"
                                    ? "black"
                                    : "#bbb",
                              }}
                            />
                            <ArrowDownwardIcon
                              style={{
                                width: "10px",
                                color:
                                  sortConfig.key === column.accessor &&
                                  sortConfig.direction === "descending"
                                    ? "black"
                                    : "#bbb",
                              }}
                            />
                          </div>
                        </TableCell>
                      )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9",
                      }}
                    >
                      <TableCell
                        key={`select-${index}`}
                        align="left"
                        style={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={row.isSelected}
                          onChange={() => handleRowSelect(index)}
                        />
                      </TableCell>
                      {columns.map(
                        (column) =>
                          column.accessor !== "select" &&
                          columnVisibility[column.accessor] && (
                            <TableCell
                              key={column.accessor}
                              align={
                                column.accessor === "date_of_birth"
                                  ? "right"
                                  : "left"
                              }
                              style={{
                                borderRight: "1px solid #ddd",
                                cursor:
                                  column.accessor === "location"
                                    ? "pointer"
                                    : "default", // Add cursor style for indicating clickable element
                              }}
                              onClick={() => {

                                if (column.accessor === "location") {
                                  setIndividualMap(true)
                                  
                                } else if (column.accessor === "name") {
                                  handleVehicleClick();
                                }
                              }}
                            >
                              {column.Cell
                                ? column.Cell({
                                    value: row[column.accessor],
                                    row,
                                  })
                                : row[column.accessor]}
                            </TableCell>
                          )
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ImportExportIcon />}
          onClick={handleExport}
          sx={{
            marginRight: "10px",
            backgroundColor: "#2c3e50",
            "&:hover": {
              backgroundColor: "#1a242f",
            },
          }}
        >
          Export
        </Button>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2>Manage Columns</h2>
            {columns.map((column) => (
              <div
                key={column.accessor}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{column.Header}</span>
                <Switch
                  checked={columnVisibility[column.accessor]}
                  onChange={() => handleColumnVisibilityChange(column.accessor)}
                />
              </div>
            ))}
          </Box>
        </Modal>
        <Modal
          open={assetDetailsModalOpen}
          onClose={() => setAssetDetailsModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper>
                  <h3>Asset Details</h3>
                  <br />
                  <p>Asset Name</p>
                  <p>Device Id</p>
                  <p>Device Description</p>
                  <p>Device Status</p>
                  <p>SIM Number or SAT</p>
                  <p>Driver Name</p>
                  <p>Driver Mobile No</p>
                  <p>Battery Size</p>
                  <p>KM Reading</p>
                  <p>Max Speed Limit</p>
                  <p>Provider 3G or SAT</p>
                  <p>Engine Runtime</p>
                  <p>Sensor Type</p>
                  <p>Message Cause</p>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Current Location</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Distance Travel(Today)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Max Speed</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Distance Graph(Last 7 Days)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Speed Graph(Last 3 hours)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Landmark Report(Last 10 Records)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Distance Location(Last 10 Records)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>All Points(Last 20 Records)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Stop Report(Last 10 Records)</h3>
                  <br />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper>
                  <h3>Area In/Out Report(Last 10 Records)</h3>
                  <br />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Modal>
        {/* 
        <Modal
          open={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
           
    <Box sx={style}>
    <div style={{ height: '500px', width: '100%' }}>
      <iframe
        src={`https://maps.google.com/maps?q=${latitude[1]},${longitude[1]}&z=${zoom}&output=embed`}
        style={{ border: 0, height: '100%', width: '100%' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="google map"
      ></iframe>
    </div>
          </Box>
    
        </Modal> */}
      </div>
    </>
  );
};
