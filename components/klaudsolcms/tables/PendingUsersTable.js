import Link from "next/link";
import AppButtonSm from "../buttons/AppButtonSm";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { BiCheck, BiX } from "react-icons/bi";
import { useState } from "react";
import AppButtonSpinner from "../AppButtonSpinner";

const BASE_URL = '/api/admin/users';

const UsersTable = ({ users, setUsers, token }) => {
    const [isLoading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0);

    const setUserList = (id) => {
        const newUserList = users.filter((user) => user.id !== id);
        setUsers(newUserList);
    }

    const approveUser = async (id) => {
        try {
            setSelected(id);
            setLoading(true);

            const url = `${BASE_URL}/${id}`;
            const params = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            await slsFetch(url, params);

            setUserList(id);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const rejectUser = async (id) => {
        try {
            setSelected(id);
            setLoading(true);

            const url = `${BASE_URL}/${id}`;
            const params = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            await slsFetch(url, params);

            setUserList(id);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="table_general_main">
            <table id="table_general">
                {/*table head*/}
                <thead>
                    <tr>
                        <th className="table--expand_first"> Name </th>
                        <th> Email </th>
                        <th> Created At </th>
                        <th className="table--shrink_cell table--center_cell"> Approve / Reject </th>
                    </tr>
                </thead>
                {/*table body*/}
                <tbody>
                    {users.map((user) => (
                        <tr className="table_row--default_cursor" key={user.id}>
                            <td className="table--expand_first">{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.createdAt}</td>
                            <td className="table--shrink_cell table--center_cell">
                                {(!isLoading || (isLoading && (selected !== user.id))) &&
                                    <>
                                        <AppButtonSm
                                            className="users__pending_button users__pending_button--approve"
                                            icon={<BiCheck />}
                                            onClick={() => approveUser(user.id)}
                                            isDisabled={isLoading}
                                        />
                                        <AppButtonSm
                                            className="users__pending_button users__pending_button--reject"
                                            icon={<BiX />}
                                            onClick={() => rejectUser(user.id)}
                                            isDisabled={isLoading}
                                        />
                                    </>
                                }
                                {(isLoading && (selected === user.id)) && <AppButtonSpinner />}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
