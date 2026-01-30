// FIYAZ AHMED
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../actions/userActions';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Error from '../components/Error';

export default function Loginscreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginState = useSelector((state) => state.loginUser);
  const { loading, error, userInfo } = loginState;

  useEffect(() => {
    if (userInfo) {
      console.log('User logged in successfully:', userInfo);
      console.log('Current user in localStorage after login:', JSON.parse(localStorage.getItem('currentUser')));
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = { email, password };
    console.log('Attempting login with:', user);
    dispatch(loginUser(user));
  };

  return (
    <div>
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5 text-left shadow-lg p-3 mb-5 bg-white rounded">
          {loading && <Loading />}
          {error && <Error error={error} />}
          <h2 className="text-center mt-3" style={{ fontSize: '35px' }}>
            Login
          </h2>
          <div>
            <input
              required
              type="email"
              placeholder="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              type="password"
              placeholder="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className="btn btn-primary mt-3 mb-3">
              Confirm
            </button>
            <br />
            <a style={{ color: 'red' }} href="/register" className="mt-2">
              Click here to register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}