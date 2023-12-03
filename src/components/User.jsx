import React from "react";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import axios from "axios";
const User = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [editedUser, setEditedUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });
  const getUser = async () => {
    try {
      const res = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setUsers(res.data);
      setFilterUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const result = users.filter((user) => {
      return (
        user.name.toLowerCase().match(search.toLowerCase()) ||
        user.email.toLowerCase().match(search.toLowerCase()) ||
        user.role.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterUser(result);
  }, [search]);

  const handleEdit = (id) => {
    setEditId(id);
    const userToEdit = filterUser.find((user) => user.id === id);
    setEditedUser({ ...userToEdit });
  };
  const handleSave = () => {
    const updatedUsers = filterUser.map((user) =>
      user.id === editedUser.id ? { ...user, ...editedUser } : user
    );
    setFilterUser(updatedUsers);
    setEditId(-1); // Reset edit mode
    setEditedUser({
      id: "",
      name: "",
      email: "",
      role: "",
    });
  };
  const handleDelete = (id) => {
    const updatedUsers = filterUser.filter((user) => user.id !== id);
    setFilterUser(updatedUsers);
  };
  const handleBulkDelete = () => {
    setFilterUser([]);
  };
  const columns = [
    {
      name: "Name",
      selector: (row) =>
        editId === row.id ? (
          <input
            type="text"
            value={editedUser.name}
            onChange={(e) =>
              setEditedUser({ ...editedUser, name: e.target.value })
            }
          />
        ) : (
          row.name
        ),
    },
    {
      name: "Email",
      selector: (row) =>
        editId === row.id ? (
          <input
            type="text"
            value={editedUser.email}
            onChange={(e) =>
              setEditedUser({ ...editedUser, email: e.target.value })
            }
          />
        ) : (
          row.email
        ),
    },
    {
      name: "Role",
      selector: (row) =>
        editId === row.id ? (
          <input
            type="text"
            value={editedUser.role}
            onChange={(e) =>
              setEditedUser({ ...editedUser, role: e.target.value })
            }
          />
        ) : (
          row.role
        ),
    },
    {
      cell: (row) =>
        editId === row.id ? (
          <button
            className="btn btn-success"
            onClick={() => handleSave(row.id)}
          >
            Save
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </button>
        ),
    },
    {
      cell: (row) => (
        <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>
          Delete
        </button>
      ),
    },
  ];
  return (
    <div>
      <DataTable
        columns={columns}
        data={filterUser}
        pagination={10}
        fixedHeader
        selectableRows
        selectableRowsHighlight
        highlightOnHover
        subHeader
        subHeaderComponent={
          <div className="d-flex align-items-center justify-content-between">
            <div className="mb-10">
              <input
                type="text"
                placeholder="Search"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <button
                className="btn btn-danger"
                style={{ marginLeft: "300px" }}
                onClick={handleBulkDelete}
              >
                Bulk Delete
              </button>
            </div>
          </div>
        }
        subHeaderAlign="left"
      />
    </div>
  );
};

export default User;
