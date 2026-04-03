import React, { useState } from "react";
import { UserPlus, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    regNo: "",
    deptName: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // --- Input Validation ---
    if (!formData.name.trim()) return setError("Full name is required.");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return setError("Please provide a valid email address.");

    if (formData.password.length < 6) return setError("Password must be at least 6 characters long.");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");

    if (formData.role === "student") {
      if (!formData.regNo.trim()) return setError("Student Registration Number is required.");
      if (!formData.deptName.trim()) return setError("Department Name is required.");
    }

    try {
      // Pass the fully constructed formData object (as configured in updated AuthContext)
      await register(formData);
      
      setSuccess("Account created successfully! You can now sign in.");
      setFormData({ 
        name: "", email: "", password: "", confirmPassword: "", 
        role: "student", regNo: "", deptName: "" 
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 50%, #ecfdf5 100%)'}}>
      <div className="w-full max-w-md my-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edubridge</h1>
              <p className="text-sm text-gray-600">SNS College of Technology</p>
            </div>
          </div>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                id="role"
                name="role"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input id="name" type="text" name="name" placeholder="Enter your full name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input id="reg-email" type="email" name="email" placeholder="Enter your college email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={handleChange} required />
            </div>

            {formData.role === "student" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="regNo" className="block text-sm font-medium text-gray-700 mb-2">Reg Number</label>
                  <input id="regNo" type="text" name="regNo" placeholder="Registration Number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.regNo} onChange={handleChange} required />
                </div>
                <div>
                  <label htmlFor="deptName" className="block text-sm font-medium text-gray-700 mb-2">Dept Name</label>
                  <input id="deptName" type="text" name="deptName" placeholder="Department Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.deptName  } onChange={handleChange} required />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input id="reg-password" type={showPassword ? "text" : "password"} name="password" placeholder="Create a password (min 6 chars)" className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input id="confirm-password" type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Validate password" className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.confirmPassword} onChange={handleChange} required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {onSwitchToLogin && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button onClick={onSwitchToLogin} className="text-blue-600 font-medium hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2026 SNS College of Technology. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};