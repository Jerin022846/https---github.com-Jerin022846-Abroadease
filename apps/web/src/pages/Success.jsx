import React from 'react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const markPremium = async () => {
      try {
        const res = await fetch('http://localhost:1096/backend/me/subscribe-premium', {
          method: 'POST',
          credentials: 'include',
        });
        const data = await res.json();
        setUser({ ...user, subscription: data.subscription });
        navigate('/'); 
      } catch (err) {
        console.error(err);
      }
    };
    markPremium();
  }, []);
  
  //return <h1>Payment Successful! Redirecting...</h1>;

  return (
    <div style={{ background: '#e6fff2', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 8px #0001' }}>
        <div style={{ fontSize: '3rem', color: 'green' }}>✔</div>
        <h2>Payment Successful!</h2>
        <p>Thank you for your subscription. You now have access to all the amazing features!</p>
        <button
          style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          &larr; Back to Main
        </button>
      </div>
    </div>
  );
};

export default Success;





