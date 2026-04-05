import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

export default function App() {
  const [role, setRole] = useState("viewer");
  const [search, setSearch] = useState("");

  //  Static data 
  const [transactions, setTransactions] = useState([
  { id: 1, date: "Apr 1", category: "Food", amount: -500, type: "expense" },
  { id: 2, date: "Apr 2", category: "Salary", amount: 15000, type: "income" },
  { id: 3, date: "Apr 3", category: "Shopping", amount: -1200, type: "expense" },
  { id: 4, date: "Apr 4", category: "Bills", amount: -800, type: "expense" },
  { id: 5, date: "Apr 5", category: "Appliance", amount: -2500, type: "expense" },
  { id: 6, date: "Apr 6", category: "Freelance", amount: 4000, type: "income" },
  { id: 7, date: "Apr 7", category: "Travel", amount: -3000, type: "expense" },
  { id: 8, date: "Apr 8", category: "Entertainment", amount: -700, type: "expense" },
  { id: 9, date: "Apr 9", category: "Investment", amount: -2000, type: "expense" },
  { id: 10, date: "Apr 10", category: "Bonus", amount: 3000, type: "income" },
  { id: 11, date: "Apr 11", category: "Groceries", amount: -900, type: "expense" },
  { id: 12, date: "Apr 12", category: "Rent", amount: -5000, type: "expense" },
  { id: 13, date: "Apr 13", category: "Health", amount: -1200, type: "expense" },
  { id: 14, date: "Apr 14", category: "Education", amount: -1500, type: "expense" },
  { id: 15, date: "Apr 15", category: "Bonus", amount: 1000, type: "income" }
  ]);

  //  Filter
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) =>
      t.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, transactions]);

  //  Calculations
  const totalBalance = transactions.reduce((a, t) => a + t.amount, 0);
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, t) => a + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, t) => a + t.amount, 0);

  // Category Data
  const categoryData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
      }
    });
    return Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));
  }, [transactions]);

  const highestSpending =
    categoryData.sort((a, b) => b.value - a.value)[0]?.name;

  // Trend Data
  const trendData = transactions.map((t, i) => ({
    name: t.date,
    balance: transactions
      .slice(0, i + 1)
      .reduce((a, t) => a + t.amount, 0),
  }));

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];

  //  Add
  const addTransaction = () => {
    const newTx = {
      id: Date.now(),
      date: "Apr 5",
      category: "Other",
      amount: -300,
      type: "expense",
    };
    setTransactions([...transactions, newTx]);
  };

  //  Delete (temporary)
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>

      {/* Sidebar */}
      <div style={{ width: "200px", background: "white", padding: "20px" }}>
        <h2>Finance</h2>
        <p>Dashboard</p>
        <p>Transactions</p>
        <p>Insights</p>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "20px" }}>

        {/* Topbar */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Dashboard</h2>

          <div>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>

            {role === "admin" && (
              <button onClick={addTransaction} style={{ marginLeft: "10px" }}>
                Add
              </button>
            )}
          </div>
        </div>

        {/* Cards */}
        <div style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
          flexWrap: "wrap"
        }}>
          <Card title="Total Balance" value={totalBalance} />
          <Card title="Income" value={income} color="green" />
          <Card title="Expenses" value={Math.abs(expenses)} color="red" />
        </div>

        {/* Charts */}
        <div style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap"
        }}>
          <div style={chartStyle}>
            <h3>Balance Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={chartStyle}>
            <h3>Spending Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name">
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div style={{ ...cardStyle, marginTop: "20px" }}>
          <h3>Insights</h3>
          <p>Highest Spending: {highestSpending || "N/A"}</p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginTop: "20px", padding: "8px", width: "100%" }}
        />

        {/* Table */}
        <table style={{
          width: "100%",
          marginTop: "20px",
          background: "white"
        }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              {role === "admin" && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5">No transactions</td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td>{t.type}</td>
                  <td style={{
                    color: t.amount > 0 ? "green" : "red"
                  }}>
                    ₹{t.amount}
                  </td>

                  {role === "admin" && (
                    <td>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        style={{ color: "red" }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}

// Card Component
function Card({ title, value, color }) {
  return (
    <div style={cardStyle}>
      <p>{title}</p>
      <h3 style={{ color }}>{value}</h3>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  flex: 1,
  minWidth: "150px"
};

const chartStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  flex: 1,
  minWidth: "300px"
};
