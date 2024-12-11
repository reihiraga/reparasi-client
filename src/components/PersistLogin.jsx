/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import { Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/api/authSlice";
import { useRefreshMutation } from "@/api/authApiSlice";
import usePersist from "../hooks/persist";
import { useEffect, useRef, useState } from "react";
import { SyncLoader } from "react-spinners";

const PersistLogin = () => {
  const [persist] = usePersist();
  const accessToken = useSelector(selectCurrentToken);
  const effectRan = useRef(false);
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          await refresh();

          setTrueSuccess(true);
        } catch (error) {
          console.log(error);
        }
      };

      if (!accessToken && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);
  }, []);

  let app;

  // kondisi jika persist false, biasanya pd saat belum login
  if (!persist) {
    app = <Outlet />;
    // kondisi ini terjadi saat refresh sedang dieksekusi
  } else if (isLoading) {
    app = <SyncLoader color="#000000" size={20} />;

    // Kondisi error terjadi saat refresh gagal memperoleh accessToken terbaru
  } else if (isError) {
    app = (
      <p>
        {`${error?.data?.message}`}
        <Link to="/login">Harap login kembali</Link>
      </p>
    );

    // kondisi jika refresh method berhasil memperoleh accessToken baru
  } else if (isSuccess && trueSuccess) {
    app = <Outlet />;

    // kondisi jika kita baru pertama kali login ke aplikasi dan refresh belum diperlukan/dijalankan
  } else if (accessToken && isUninitialized) {
    app = <Outlet />;
  }

  return app;
};

export default PersistLogin;
