// FIYAZ AHMED
import API from "../api";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoffees } from "../actions/userActions";
import CFE from "../components/CFE";
import Loading from "../components/Loading";
import Error from "../components/Error";

export default function Homepage() {
  const dispatch = useDispatch();

  const coffeeState = useSelector((state) => state.coffee);
  const { coffees, loading, error } = coffeeState;

  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState(
    localStorage.getItem("selectedBranchId") || ""
  );

  // ✅ Load branches once (no branchId inside)
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const { data } = await API.get("/api/branches");
        const branchList = Array.isArray(data) ? data : [];
        setBranches(branchList);

        if (!localStorage.getItem("selectedBranchId") && branchList.length > 0) {
          const first = branchList[0]._id;
          localStorage.setItem("selectedBranchId", first);
          setBranchId(first);
        }
      } catch (e) {
        console.error("Failed to load branches:", e);
        setBranches([]);
      }
    };

    loadBranches();
  }, []); // ✅ now clean

  // ✅ Fetch coffees when branch changes
  useEffect(() => {
    if (!branchId) return;
    dispatch(fetchCoffees(branchId));
  }, [dispatch, branchId]);

  const onBranchChange = (e) => {
    const id = e.target.value;
    setBranchId(id);
    localStorage.setItem("selectedBranchId", id);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-3">
        <div style={{ minWidth: 280 }}>
          <label className="form-label fw-bold">Select Branch</label>
          <select
            className="form-select"
            value={branchId}
            onChange={onBranchChange}
          >
            {branches.length === 0 && (
              <option value="">No branches available</option>
            )}
            {branches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row justify-content-center">
        {loading && <Loading />}
        {error && <Error error={String(error)} />}

        {Array.isArray(coffees) && coffees.length > 0 ? (
          coffees.map((coffeeItem) => (
            <div key={coffeeItem._id} className="col-md-3">
              <CFE coffee={coffeeItem} />
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-center">
              No coffees available for this branch.
            </p>
          )
        )}
      </div>
    </div>
  );
}
