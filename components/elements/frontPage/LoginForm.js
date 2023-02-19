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
import ForceChangePasswordForm from "@/components/elements/frontPage/ForceChangePasswordForm";

const LoginForm = ({ className, logo }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, dispatch] = useReducer(authReducer, initialState);

  const onSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      (async () => {
        try {
          dispatch({ type: INIT });
          const response = await slsFetch("/api/session", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
          const { message, forcePasswordChange } = await response.json();

          if(forcePasswordChange){
            dispatch({ type: 'SET_FORCE_CHANGE_PASSWORD', payload: true });
          }
          else{
            dispatch({ type: SUCCESS });
            router.push(`/admin`);
          }

        } catch (error) {
          console.error(error);
          dispatch({ type: ERROR, payload:error.message });
        } finally {
          dispatch({ type: CLEANUP });
        }
        //}
      })();
    },
    [email, password, router]
  );

  const errorBox = useRef();
  const successBox = useRef();

  useFadeEffect(errorBox, [state.submitted, state.isError]);
  useFadeEffect(successBox, [state.submitted, state.isLoginSuccessful]);

  return (
    <div className="container_login_form">
      {!state.isForceChangePassword && <>
      <div className="img_login_logo img-responsive">
        <Image
          placeholder="blur"
          blurDataURL={logo?.link ?? '/logo-180x180.png'}
          src={logo?.link ?? '/logo-180x180.png'}
          alt="cms-logo"
          width={200}
          height={90}
        />
      </div>

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
          <p>Welcome back! Logging you in...</p>{" "}
        </div>
        <label className="mb-2 mt-3">Email</label>
        <input
          type="email"
          className="input_login"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="mb-2 mt-4">Password</label>
        <input
          type="password"
          className="input_login"
          autoComplete="email"
          onChange={(e) => !state.isLoading && setPassword(e.target.value)}
        />
      </div>
      <Link href="/admin/" passHref>
        <button className="btn_login" onClick={onSubmit}>
          {state.isLoading && <AppButtonSpinner />} Log in
        </button>
      </Link>
      </> 
      }
      {state.isForceChangePassword && <ForceChangePasswordForm email={email} pwd={password}/> }
    </div>
  );
};

export default LoginForm;
