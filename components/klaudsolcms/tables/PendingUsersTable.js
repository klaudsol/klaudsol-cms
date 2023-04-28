import Link from "next/link";
import AppButtonSm from "../buttons/AppButtonSm";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { BiCheck, BiX } from "react-icons/bi";
import { useContext, useState } from "react";
import AppButtonSpinner from "../AppButtonSpinner";
import CacheContext from "@/components/contexts/CacheContext";
import { approveUsers, rejectUsers } from "@/lib/Constants";

const BASE_URL = '/api/admin/users/pending';

const UsersTable = ({ users, setUsers }) => {
    const [isLoading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const { capabilities } = useContext(CacheContext);

    // The reason why I stored these two permissions on their 
    // own respective variables is because I will be using 
    // them multiple times across this file.
    const canApproveUser = capabilities.includes(approveUsers);
    const canRejectUser = capabilities.includes(rejectUsers);

    const setUserList = (id) => {
        const newUserList = users.filter((user) => user.id !== id);
        setUsers(newUserList);
    }

    const approveUser = async (id) => {
        try {
            setSelected(id);
            setLoading(true);

            const params = {
                method: 'PUT',
                body: JSON.stringify({ id }),
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            await slsFetch(BASE_URL, params);

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

            const url = `${BASE_URL}?id=${id}`;
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
                        {(canApproveUser || canRejectUser) &&
                            <th className="table--shrink_cell table--center_cell"> Approve / Reject </th>
                        }
                    </tr>
                </thead>
                {/*table body*/}
                <tbody>
                    {users.map((user) => (
                        <tr className="table_row--default_cursor" key={user.id}>
                            <td className="table--expand_first">{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.createdAt}</td>
                            {(canApproveUser || canRejectUser) &&
                                <td className="table--shrink_cell table--center_cell">
                                    {(!isLoading || (isLoading && (selected !== user.id))) &&
                                        <>
                                            {canApproveUser &&
                                                <AppButtonSm
                                                    className="users__pending_button users__pending_button--approve"
                                                    icon={<BiCheck />}
                                                    onClick={() => approveUser(user.id)}
                                                    isDisabled={isLoading}
                                                />
                                            }
                                            {canRejectUser &&
                                                <AppButtonSm
                                                    className="users__pending_button users__pending_button--reject"
                                                    icon={<BiX />}
                                                    onClick={() => rejectUser(user.id)}
                                                    isDisabled={isLoading}
                                                />
                                            }
                                        </>
                                    }
                                    {(isLoading && (selected === user.id)) && <AppButtonSpinner />}
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
