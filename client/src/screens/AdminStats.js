import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table } from "react-bootstrap";

export default function AdminStats() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    topItems: [],
  });

  useEffect(() => {
    async function fetchStats() {
      const { data } = await axios.get("/api/admin/stats?limit=10");
      setStats(data);
    }
    fetchStats();
  }, []);

  return (
    <div className="container mt-5">
      <h3>Sales Summary</h3>
      <Card className="p-4 mb-4">
        <h5>Total Sales: ৳{Number(stats.totalSales || 0).toFixed(2)}</h5>
        <h5>Total Orders: {stats.totalOrders}</h5>
      </Card>

      <h4>Top Selling Coffees</h4>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Coffee</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(stats.topItems) && stats.topItems.length > 0 ? (
            stats.topItems.map((item, idx) => (
              <tr key={`${item.name}-${idx}`}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No sales data</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
