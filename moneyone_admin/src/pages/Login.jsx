import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, User } from 'lucide-react'
import { toast } from 'sonner'
import adminAPI from '@/api/admin_api'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function Login() {
  usePageTitle('Admin Login');
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ 
    adminId: '', 
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!credentials.adminId || !credentials.password) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const response = await adminAPI.login(
        credentials.adminId,
        credentials.password
      )

      if (response.success) {
        toast.success('Login successful! Welcome back.')
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.')
      setCredentials({ ...credentials, password: '' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12">
          <img src="/moneyone.png" alt="Moneyone" className="w-64 mb-8" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Welcome Back Admin
          </h2>
          <p className="text-gray-600 text-center text-lg">
            Your trusted payment gateway solution for seamless transactions
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-white rounded-2xl shadow-md">
              <p className="text-3xl font-bold text-blue-600">99.9%</p>
              <p className="text-sm text-gray-600 mt-1">Uptime</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-md">
              <p className="text-3xl font-bold text-purple-600">24/7</p>
              <p className="text-sm text-gray-600 mt-1">Support</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-md">
              <p className="text-3xl font-bold text-pink-600">Secure</p>
              <p className="text-sm text-gray-600 mt-1">Payments</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="flex justify-center mb-4 lg:hidden">
              <img src="/moneyone.png" alt="Moneyone" className="h-16" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sign In
            </CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="adminId" className="text-gray-700 font-medium">Admin ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="adminId"
                    type="text"
                    placeholder="Enter Admin ID"
                    value={credentials.adminId}
                    onChange={(e) => setCredentials({ ...credentials, adminId: e.target.value })}
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium text-base">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-600">Remember me</span>
                </label>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In to Dashboard'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                Contact Sales
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
