import React, { useEffect, useState } from "react";
import "./DashboardCss/Vouchers.css";
import { useGet } from "../useGet";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";

function Vouchers() {
  const [id] = useOutletContext();
  const [vouchers, setVouchers] = useState([]);

  const { data, loading } = useGet(`/api/getMyVouchers/${id}`);

  useEffect(() => {
    if (data) {
      setVouchers(data);
    }
  }, [data]);

  return (
    <div className="voucherContainer">
      {loading ? (
        <div className="ordersloadingAnimationContainer">
          <p className="loadingAnimation"></p>
        </div>
      ) : (
        <div className="vouchersInternalContainer">
          <Link to={"/dashboard"}>
            <i class="fa-solid fa-arrow-left"></i>
          </Link>
          {!vouchers.length > 0 ? (
            <div className="emptyVoucherContainer">
              <div>
                <p>
                  You do not have any vouchers, please continue shopping with us
                  to qualify for a Voucher
                </p>
                <img src="/icons/vouchers.png" />
              </div>
            </div>
          ) : (
            <div>vouchers</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Vouchers;
