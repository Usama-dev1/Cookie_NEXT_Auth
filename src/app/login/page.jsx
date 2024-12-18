"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const LoginPage = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [disabled, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };



  useEffect(() => {
    if (data.email.trim() && data.password.trim()) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Invalid Login detials");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError(`Login failed:${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-screen min-h-screen flex justify-center items-center bg-gray-100">
        {!loading ? (
          <form
            onSubmit={handleSubmit}
            className="w-[30rem] p-8 text-lg bg-black flex flex-col justify-around items-center rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-white mb-6">
              {loading ? "Processing" : "Login"}
            </h1>
            <div className="mb-4 w-full">
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <input
                type="email"
                value={data.email}
                onChange={handleChange}
                name="email"
                required
                disabled={loading}
                placeholder="Enter your email"
                className="w-full p-2 mt-2 rounded-md"
              />
            </div>
            <div className="mb-6 w-full">
              <label htmlFor="password" className="text-white">
                Password
              </label>
              <input
                onChange={handleChange}
                type="password"
                value={data.password}
                required
                name="password"
                disabled={loading}
                placeholder="Enter your password"
                className="w-full p-2 mt-2 rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={disabled}
              className="w-80 py-3 bg-gray-600 text-xl text-white rounded-md hover:bg-gray-300 hover:text-black">
              {loading ? "Processing" : "Login"}
            </button>
            <p className="text-red-500 text-2xl">{error && error}</p>
          </form>
        ) : (
          <p className="text-4xl text-black">...Loading</p>
        )}
      </div>
    </>
  );
};

export default LoginPage;
