import { useEffect, useState } from "react";
import { slsFetch } from "@klaudsol/commons/lib/Client";

import InnerSingleLayout from "@/components/layouts/InnerSingleLayout";
import CacheContext from "@/components/contexts/CacheContext";
import { getSessionCache } from "@klaudsol/commons/lib/Session";

import AppCreatebutton from "@/components/klaudsolcms/buttons/AppCreateButton";
import PendingUsersTable from "@/components/klaudsolcms/tables/PendingUsersTable";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import { useClientErrorHandler } from "@/components/hooks";
import { readPendingUsers } from "@/lib/Constants";
import { useRouter } from "next/router";

export default function PendingUsers({ cache }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const errorHandler = useClientErrorHandler();
    const router = useRouter();
    const { capabilities } = cache;

    if (!capabilities.includes(readPendingUsers)) router.push('/admin');

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);

                const url = `/api/admin/users?pending=true`;
                const params = {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
                const resRaw = await slsFetch(url, params);
                const { data } = await resRaw.json();

                setUsers(data);
            } catch (error) {
                errorHandler(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <CacheContext.Provider value={cache}>
            <InnerSingleLayout>
                <div className="mt-5 mb-3 d-flex align-items-center gap-2">
                    <h3>Pending users</h3>
                    {isLoading && <AppButtonSpinner />}
                </div>
                <PendingUsersTable users={users} setUsers={setUsers} token={cache.token} />
            </InnerSingleLayout>
        </CacheContext.Provider>
    );
}

export const getServerSideProps = getSessionCache();
