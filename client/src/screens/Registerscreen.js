// FIYAZ AHMED
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { registerUser } from '../actions/userActions';
import Loading from '../components/Loading';
import Error from '../components/Error';

export default function Registerscreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  const registerState = useSelector((state) => state.registerUser);
  const { error, loading, success } = registerState;
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (success) {
      navigate('/register-success');
    }
  }, [success, navigate]);

  function register() {
    if (password !== cpassword) {
      alert('Passwords do not match');
      return;
    }
    const userData = { email, password };
    console.log('Registering user:', userData);
    dispatch(registerUser(userData));
  }

  return (
    <div>
      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5 text-left shadow-lg p-3 mb-5 bg-white rounded">
          {loading && <Loading />}
          {error && <Error error={error} />}

          <h2 className="text-center mt-3" style={{ fontSize: '35px' }}>
            Register
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
            <input
              required
              type="password"
              placeholder="Confirm password"
              className="form-control"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
            />
            <button onClick={register} className="btn btn-primary mt-3 mb-3">
              Confirm
            </button>
            <br />
            <a style={{ color: 'red' }} href="/login" className="mt-2">
              Click here to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}