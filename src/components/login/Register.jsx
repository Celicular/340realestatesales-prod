import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../firebase/auth';
import { addUser } from '../../firebase/firestore';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'agent'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Registration attempt started');
    console.log('📝 Form data:', formData);
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      console.log('❌ Validation failed: Missing fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      console.log('❌ Validation failed: Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      console.log('❌ Validation failed: Password too short');
      return;
    }

    console.log('✅ Validation passed');

    try {
      console.log('🔥 Creating Firebase Auth user...');
      
      // Step 1: Create Firebase Auth user
      const authResult = await registerUser(formData.email, formData.password, formData.name);
      
      if (!authResult.success) {
        setError(authResult.error);
        console.log('❌ Firebase Auth registration failed:', authResult.error);
        return;
      }

      console.log('✅ Firebase Auth user created:', authResult.user);

      // Step 2: Save additional user data to Firestore
      const userData = {
        uid: authResult.user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        displayName: formData.name,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('📝 Saving user data to Firestore:', userData);
      
      const firestoreResult = await addUser(userData);
      
      if (!firestoreResult.success) {
        setError('User created but failed to save profile data: ' + firestoreResult.error);
        console.log('❌ Firestore save failed:', firestoreResult.error);
        return;
      }

      console.log('✅ User data saved to Firestore:', firestoreResult);

      // Step 3: Set session data (for compatibility with existing system)
      localStorage.setItem('userToken', authResult.user.uid);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userRole', formData.role);
      localStorage.setItem('userId', authResult.user.uid);
      
      console.log('🔑 Session data set in localStorage');
      console.log('🔄 Redirecting to dashboard for role:', formData.role);
      
      // Redirect based on role
      if (formData.role === 'admin') {
        navigate('/admin/admindashboard');
      } else if (formData.role === 'agent') {
        navigate('/agent/agentdashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      console.error('❌ Registration error:', error);
      setError('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-tropical-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">
          Register
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-white"
              required
            >
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-brand-dark text-white p-3 rounded-lg hover:bg-brand-dark/90"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-dark hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
