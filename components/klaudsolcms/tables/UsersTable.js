import Link from "next/link";
import { readContents } from "@/lib/Constants";

const UsersTable = ({ users }) => {
  return (
    <div id="table_general_main">
      <table id="table_general">
        {/*table head*/}
        <thead>
          <tr>
            <th> Name </th>
            <th> Email </th>
            <th> Role </th>
            <th> Created At </th>
            <th> Enabled </th>
          </tr>
        </thead>
        {/*table body*/}
        <tbody>
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/admin/users/${user.id}`}
              passHref
              legacyBehavior
            >
              <tr>
                <td className="table--expand_cell">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.createdAt}</td>
                <td className="table--shrink_cell">{user.loginEnabled && "True"}</td>
              </tr>
            </Link>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
