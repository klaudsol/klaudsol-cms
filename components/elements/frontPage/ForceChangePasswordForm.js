import { useState, useCallback, useRef, useReducer, useEffect } from "react";
import { useFadeEffect } from "@/components/Util";
import { slsFetch } from "@klaudsol/commons/lib/Client";
import { useRouter } from "next/router";
import Link from "next/link";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import { authReducer, initialState } from "@/components/reducers/authReducer";
import { INIT, ERROR, CLEANUP, SUCCESS } from "@/lib/actions";
import CacheContext from "@/components/contexts/CacheContext";

const ForceChangePasswordForm = ({ pwd }) => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [state, dispatch] = useReducer(authReducer, initialState);

  const onSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      (async () => {
        try {
          dispatch({ type: INIT });
          const response = await slsFetch("/api/me/password", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
            body: JSON.stringify({ currentPassword:pwd, newPassword, confirmNewPassword }),
          });
          dispatch({ type: SUCCESS });
          router.push('/admin');
        } catch (error) {
          console.log(error)
          dispatch({ type: ERROR, payload: error?.message });
        } finally {
          dispatch({ type: CLEANUP });
        }
        //}
      })();
    },
    [newPassword, confirmNewPassword, pwd, router]
  );

  const errorBox = useRef();
  const successBox = useRef();

  useFadeEffect(errorBox, [state.submitted, state.isError]);
  useFadeEffect(successBox, [state.submitted, state.isLoginSuccessful]);

  return (
    <>
          <h4> Choose a new Password </h4>

          <div className="form_login">
            <div
              ref={errorBox}
              className="alert alert-danger useFadeEffect px-3 pt-3 pb-2 mb-0 mt-3"
            >
              {" "}
              <p> {state.errorMessage} </p>{" "}
            </div>
            <div
              ref={successBox}
              className="alert alert-success useFadeEffect px-3 pt-3 pb-2 mb-0 mt-3"
            >
              {" "}
              <p>Welcome! Logging you in...</p>{" "}
            </div>
            <label className="mb-2 mt-3">New password</label>
            <input
              type="password"
              className="input_login"
              autoComplete="email"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label className="mb-2 mt-4">Confirm new password</label>
            <input
              type="password"
              className="input_login"
              autoComplete="email"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <Link href="/admin/" passHref>
            <button className="btn_login" onClick={onSubmit}>
              {state.isLoading && <AppButtonSpinner />} Change Password
            </button>
          </Link>
    </>
  );
};

export default ForceChangePasswordForm;
