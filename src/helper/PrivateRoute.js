import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { API } from "../utils/Axios";
import authAction from "../redux/actions/auth";

export function PrivateRoute() {
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    
    const cekToken = useCallback(() => {
        API.getProfile(token)
        .catch(() => dispatch(authAction.resetReducer()))
    },[])

    useEffect(() => {
        cekToken()
    },[])

  return token ? <Outlet /> : <Navigate to={"/"} replace />;
}