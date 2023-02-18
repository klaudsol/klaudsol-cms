import { useState, useCallback, useRef, useReducer, useEffect } from "react";
import {
  useLoginMode,
  LOGIN_MODE_SIGNUP,
} from "@/components/contexts/LoginModeContext";
import { useFadeEffect, slsFetch } from "@/components/Util";
import { useRouter } from "next/router";
import styles from "@/styles/FrontPageLayout.module.scss";
import Link from "next/link";
import Image from "next/image";
import AppButtonSpinner from "@/components/klaudsolcms/AppButtonSpinner";
import { authReducer, initialState } from "@/components/reducers/authReducer";
import { INIT, ERROR, CLEANUP, SUCCESS } from "@/lib/actions";

const ForceChangePasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [state, dispatch] = useReducer(authReducer, initialState);

  const onSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      (async () => {
        try {
          if(newPassword !== confirmNewPassword){
            throw new Error('Error')
          }
          const response = await slsFetch("/api/auth/forceChangePassword", {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ newPassword, confirmNewPassword }),
          });
        } catch (ex) {
          console.error(ex);
          dispatch({ type: ERROR });
        } finally {
          dispatch({ type: CLEANUP });
        }
        //}
      })();
    },
    [newPassword, confirmNewPassword]
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
              <p>Password does not match</p>{" "}
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
