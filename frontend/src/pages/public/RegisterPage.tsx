import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { UserRole, BloodGroup } from '../../types';
import { HeartHandshake } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>('DONOR');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [city, setCity] = useState<string>('Lucknow');
  const [area, setArea] = useState<string>('Hazratganj');
  const [hospitalName, setHospitalName] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const res: any = await authService.register({
        name,
        email,
        phone,
        password,
        role,
        bloodGroup: role === 'DONOR' ? bloodGroup : undefined,
        city,
        area,
        hospitalName: role === 'HOSPITAL' ? hospitalName : undefined,
        bankName: role === 'BLOOD_BANK' ? bankName : undefined,
      });

      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        switch (res.data.user.role) {
          case 'DONOR':
            navigate('/donor/dashboard');
            break;
          case 'REQUESTER':
            navigate('/requester/dashboard');
            break;
          case 'HOSPITAL':
            navigate('/hospital/dashboard');
            break;
          case 'BLOOD_BANK':
            navigate('/blood-bank/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check form details.');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <HeartHandshake className="w-8 h-8 text-red-600 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Create LIFE-LINK Account</h2>
          <p className="text-xs text-gray-500">Register as a donor, requester, hospital, or blood bank.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Select Account Role</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['DONOR', 'REQUESTER', 'HOSPITAL', 'BLOOD_BANK'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 px-2 rounded text-xs font-semibold border ${
                    role === r
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Full Name / Contact Person</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919812345678"
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {role === 'DONOR' && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          )}

          {role === 'HOSPITAL' && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Registered Hospital Name</label>
              <input
                type="text"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="Apex Super Speciality Hospital"
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
              />
            </div>
          )}

          {role === 'BLOOD_BANK' && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Blood Bank Name</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Regional City Blood Bank"
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Lucknow"
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Area / Locality</label>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Hazratganj"
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded transition-colors mt-2"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="text-red-600 font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
