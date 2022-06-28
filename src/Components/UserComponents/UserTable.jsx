import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useQuery } from "react-query";
import { getUsersList } from "../../IronsightAPI";

import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { useRowSelect } from '@table-library/react-table-library/select';
import {DEFAULT_OPTIONS, getTheme} from "@table-library/react-table-library/material";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { usePagination } from '@table-library/react-table-library/pagination';

import {
    Table,
    Header,
    HeaderRow,
    Body,
    Row,
    HeaderCell,
    Cell,
  } from '@table-library/react-table-library/table';

import {
  Stack,
  TextField,
  Modal,
  TablePagination,
} from '@mui/material';

import { useSort, HeaderCellSort } from "@table-library/react-table-library/sort";
import { FaSearch } from "react-icons/fa";
import useUserData from "./UserData";
import LinearProgress from "@mui/material/LinearProgress";
import CreateUser from "../CreateUser";


// import { nodes } from './data';


const key = "Search";

//THESE ARE YOUR OPTIONS FOR TABLE CSS
// export declare type Theme = {
//   Table?: string;
//   Header?: string;
//   Body?: string;
//   BaseRow?: string;
//   HeaderRow?: string;
//   Row?: string;
//   BaseCell?: string;
//   HeaderCell?: string;
//   Cell?: string;
// };


// const DEFAULT_OPTIONS: {
//   horizontalSpacing: number;
//   verticalSpacing: number;
//   striped: boolean;
//   highlightOnHover: boolean;
// };

const UserTable = () => {

  //set data to users_data (DATA MUST BE NAMED NODES)
  const nodes = useUserData();
  let data = nodes;

  

  const materialTheme = getTheme({
    ...DEFAULT_OPTIONS,
    
    highlightOnHover: true,
  });

  const customTheme = {

    Table: `
    margin: 5px 5px;
    background-color: transparent;
    border-radius: 10 px;

    height: 100%;
    color: pink;

    &.my-table {
      background-color: orange;
     }

    .hover-row {
      background-color: #blue;
    }

    
    
  `,

  Body:
  `
    
    background-color: transparent;
  
  `,

  BaseRow:
  `
  
    background-color: transparent;
  
  `,

  BaseCell: `
      &:nth-of-type(1) {
        min-width: 30%;
        width: 30%;
      }

      &:nth-of-type(3) {
        min-width: 20%;
        width: 20%;
      }


      &:nth-of-type(2), &:nth-of-type(4) {
        min-width: 15%;
        width: 15%;
      }

      &:nth-of-type(5) {
        min-width: 20%;
        width: 20%;
      }
    `,

    Cell:
     `
    font-size: 16px;

    &:nth-of-type(1) {
      min-width: 20%;
      width: 20%;
      color: #DDDDDF;
      background-color: #2f3137;
      
    }

    &:nth-of-type(2), &:nth-of-type(3), &:nth-of-type(4) {
      min-width: 30%;
      width: 30%;
      color: #DDDDDF;
      background-color: #2f3137;
    }

    &:nth-of-type(5) {
      min-width: 25%;
      width: 25%;
      color: #DDDDDF;
      background-color: #2f3137;
    }


  
    border-right: 1px solid transparent;
    `,

    HeaderRow:
    `
    
      background-color: #1E1E1E;
      color: #DDDDDF;
      
    
    `,

    Row:
    `
    &:hover {
      color: purple;

      background-color: #1E1E1E;
      opacity: 0.9;

    }
    
      background-color: purple;
    
    `,
  };

  
  const theme = useTheme([materialTheme, customTheme]);



//   const select = useRowSelect(data);

// // get all state
// console.log(select.state);


  // const select = useRowSelect(
  //   data, 
  //   {
      
  //     onChange: onSelectChange,
  //   });

  // function onSelectChange(action, state) {

  //     console.log(action, state);

  //   }


  
      let navigate = useNavigate();

       //function to handle linking the click of the row
       
       function handleClick(item) {
         var user_link_details = "/user_details/" + item;
         navigate(user_link_details);
      }
  


   const pagination = usePagination(
     data,
      {
    state: {
      page: 0,
      size: 15,
    },
    onChange: onPaginationChange,
  });

  function onPaginationChange(action, state) {
    console.log(action, state);
  }



  const [search, setSearch] = React.useState("");

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };


  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortIcon: {
        iconDefault: null,
        iconUp: <FaChevronUp />,
        iconDown: <FaChevronDown />,
      },
      sortFns: {
        USER: (array) =>
          array.sort((a, b) => a.first_name?.localeCompare(b.first_name)),
        ROLE: (array) =>
          array.sort((a, b) => a.user_role?.localeCompare(b.user_role)),
        COURSES: (array) =>
          array.sort((a, b) => a.course_id_list?.localeCompare( b.course_id_list)),
        COURSENUM: (array) =>
          array.sort((a, b) => (b.course_num || []) - (a.course_num || [])),
        VMNUM: (array) =>
          array.sort((a, b) => (b.vm_num || []) - (a.vm_num || [])),
      },
    }
  );  


  function onSortChange(action, state) {
    console.log(action, state);
  }

  //* Modal *//

  const [modalOpened, setModalOpened] = React.useState(false);

  if (!nodes) {
    return <LinearProgress />;
  }

  console.log("Top Table Data:", data);

  data = {
    id: "users",
    nodes: data.filter((item) =>
      item.user_name.toLowerCase().includes(search.toLowerCase())
    ),
  };



  return (
    <>

      <Modal open={modalOpened} onClose={() => setModalOpened(false)}>
      <div className="rounded-box bg-base-100 mx-4 md:my-20 lg:mx-88">
          <h2 className="collapse-title text-center text-base-900">
            Create User
          </h2>
          <CreateUser />
        </div>
      </Modal>

      <Stack spacing={100} direction="row-reverse" className="m-3 ">

        <button variant="contained" onClick={() => setModalOpened(true)} className="btn btn-primary btn-med text-base-900 hover cursor-pointer " >
          Create User
        </button>

        <TextField
          label="Search Users"
          value={search}
          icon={<FaSearch />}
          onChange={handleSearch}
        />
  
      </Stack>

      
      

         <div className="grid  gap-4 m-4 "> 
         
            <Table 
            // columns={COLUMNS} 
            data={data}
            sort={sort}
            theme={theme}
            // select={select}
            layout={{ custom: true }}
            pagination={pagination}>

                {(tableList) => (

                <>
                    <Header>
                        <HeaderRow>
                              <HeaderCellSort sortKey="USER">User</HeaderCellSort>
                              <HeaderCellSort sortKey="ROLE">Role</HeaderCellSort>
                              <HeaderCellSort sortKey="COURSES">Courses</HeaderCellSort>
                              <HeaderCellSort sortKey="COURSENUM"># of Courses</HeaderCellSort>
                              <HeaderCellSort sortKey="VMNUM"># of VMs</HeaderCellSort>
                        </HeaderRow>
                    </Header>


                    <Body>
                        {tableList.map((item) => (
                          
                            
                            <Row key={item.id} item={item} 
                            
                            onClick={() => {
                            handleClick(item.user_name);
                            }}

                            className="bg-slate-900 hover:bg-base-200 cursor-pointer"
                            >
                             
                                    <Cell>{item.thumbnail}</Cell>
                                    <Cell>{item.user_role}</Cell>
                                    <Cell>{item.course_id_list}</Cell>
                                    <Cell>{item.course_num}</Cell>
                                    <Cell>{item.vm_num}</Cell>

                            </Row>
                        ))}
                    </Body>
                </>
                )}

            </Table>

        </div>
         

      <br />
      

      <Stack spacing={10}>
          <TablePagination
            count={data.nodes.length}
            page={pagination.state.page}
            rowsPerPage={pagination.state.size}
            rowsPerPageOptions={[10, 15, 20]}
            onRowsPerPageChange={(event) =>
              pagination.fns.onSetSize(parseInt(event.target.value, 10))
            }
            onPageChange={(event, page) => pagination.fns.onSetPage(page)}
          />
      </Stack>
      
    </>
  );
};

export default UserTable;
