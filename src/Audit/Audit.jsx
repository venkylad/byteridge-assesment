import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userActions } from "../_actions";
import moment from "moment";
import "./Audit.css";

import { Navbar, Nav } from "react-bootstrap";
class Auditpage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeFormat: "hh",
      currPage: 1,
      usersPerPage: 20,
      search: "",
      sortingBy: "",
    };

    this.handleChangeFormat = this.handleChangeFormat.bind(this);
  }

  componentDidMount() {
    this.props.getUsers();
  }

  handleDeleteUser(id) {
    return (e) => this.props.deleteUser(id);
  }

  handleChangeFormat() {
    return this.setState({ format12H: !this.state.format12H });
  }

  render() {
    const { currPage, usersPerPage, timeFormat, search, sortingBy } =
      this.state;
    const { user, users } = this.props;

    const lastPost = currPage * usersPerPage;
    const firstPost = lastPost - usersPerPage;
    const totalUsers =
      users.items &&
      users.items
        .filter((item) => {
          if (sortingBy === "") {
            return item;
          } else {
            return item.role === sortingBy;
          }
        })
        .filter((value) => {
          if (search == "" || search == " ") {
            return value;
          } else if (
            value.firstName.toLowerCase().includes(search.toLowerCase())
          ) {
            return value;
          }
        });
    const currUsers = totalUsers && totalUsers.slice(firstPost, lastPost);

    const formatDate = `DD/MM/YYYY ${timeFormat}:mm:ss`;

    const pageNumbers = [];

    for (
      let i = 1;
      i <= Math.ceil(totalUsers && totalUsers.length / usersPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand></Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link>
              <Link to="/">Home</Link>
            </Nav.Link>
            <Nav.Link href="#features">Auditor</Nav.Link>
            <Nav.Link>
              {" "}
              <Link to="/login">Logout</Link>
            </Nav.Link>
          </Nav>
        </Navbar>

        <div className="col-sm-12 col-md-6">
          <h1>Hi {user.firstName}!</h1>
          <p>You're logged in with React!!</p>
          <h3>All login audit :</h3>

          <div className="filters">
            <select
              value={timeFormat}
              onChange={(e) => this.setState({ timeFormat: e.target.value })}
            >
              <option name="12" value="hh">
                12 Hour Format
              </option>
              <option name="24" value="HH">
                24 Hour Format
              </option>
            </select>

            <input
              type="text"
              value={search}
              onChange={(e) => this.setState({ search: e.target.value })}
              placeholder="Search By Name"
            />
            <select
              value={sortingBy}
              onChange={(e) => this.setState({ sortingBy: e.target.value })}
            >
              <option name="all" value="">
                Show All
              </option>
              <option name="Auditor" value="Auditor">
                Show Auditors
              </option>
              <option name="User" value="user">
                Shor Users
              </option>
            </select>
          </div>
          {users.loading && <em>Loading users...</em>}
          {users.error && (
            <span className="text-danger">ERROR: {users.error}</span>
          )}
          {users.items && (
            <table>
              <tr>
                <th>User ID</th>
                <th>Role</th>
                <th>Created At</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Delete</th>
              </tr>
              {currUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.role}</td>
                  <td className="date">
                    {moment(user.createdDate).format(formatDate)}
                  </td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    {user.deleting ? (
                      <em> - Deleting...</em>
                    ) : user.deleteError ? (
                      <span className="text-danger">
                        {" "}
                        - ERROR: {user.deleteError}
                      </span>
                    ) : (
                      <span>
                        {" "}
                        - <a onClick={this.handleDeleteUser(user.id)}>Delete</a>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </table>
          )}
          {search === "" && (
            <nav className="paginate">
              <ul className="pagination">
                {pageNumbers.map((item, i) => (
                  <li key={i} className="page-item">
                    <a
                      href="#"
                      className="page-link"
                      onClick={() => this.setState({ currPage: item })}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    );
  }
}

function mapState(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return { user, users };
}

const actionCreators = {
  getUsers: userActions.getAll,
  deleteUser: userActions.delete,
};

const connectedAuditPage = connect(mapState, actionCreators)(Auditpage);
export { connectedAuditPage as Auditpage };
