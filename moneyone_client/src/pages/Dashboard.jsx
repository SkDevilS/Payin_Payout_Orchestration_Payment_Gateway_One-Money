import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  TrendingUp, DollarSign, 
  ArrowUpCircle, ArrowDownCircle, Clock, RefreshCw, Wallet
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import clientAPI from '@/api/client_api'
import { toast } from 'sonner'

const StatCard = ({ title, amount, trend, icon: Icon, color }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{formatCurrency(amount)}</div>
      {trend && (
        <p className="text-xs text-muted-foreground mt-1">
          <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
            {trend > 0 ? '+' : ''}{trend}%
          </span> from yesterday
        </p>
      )}
    </CardContent>
  </Card>
)

const TimeRangeStats = ({ title, data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
          <span className="text-sm font-medium text-gray-600">Payin</span>
          <span className="text-lg font-bold text-green-600">{formatCurrency(data.payin)}</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
          <span className="text-sm font-medium text-gray-600">Payout</span>
          <span className="text-lg font-bold text-blue-600">{formatCurrency(data.payout)}</span>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [walletData, setWalletData] = useState({
    balance: 0,
    netPayin: 0,
    grossPayin: 0,
    payinCharges: 0,
    totalPayout: 0,
    settled_balance: 0,
    unsettled_balance: 0
  })
  const [payinStats, setPayinStats] = useState({
    success: { count: 0, amount: 0 },
    pending: { count: 0, amount: 0 },
    failed: { count: 0, amount: 0 }
  })
  const [payoutStats, setPayoutStats] = useState({
    success: { count: 0, amount: 0 },
    pending: { count: 0, amount: 0 },
    failed: { count: 0, amount: 0 },
    queued: { count: 0, amount: 0 }
  })
  const [timeRangeData, setTimeRangeData] = useState({
    today: { payin: 0, payout: 0 },
    yesterday: { payin: 0, payout: 0 },
    last7days: { payin: 0, payout: 0 },
    last30days: { payin: 0, payout: 0 },
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch wallet data, payin stats, and payout stats in parallel
      const [walletResponse, payinStatsResponse, payoutStatsResponse] = await Promise.all([
        clientAPI.getWalletOverview(),
        clientAPI.getPayinStats(),
        clientAPI.getPayoutStats()
      ])
      
      if (walletResponse.success && walletResponse.data) {
        setWalletData({
          balance: walletResponse.data.balance || 0,
          netPayin: walletResponse.data.payin_amount || 0,  // Net PayIN (after charges)
          grossPayin: walletResponse.data.gross_payin || 0,  // Gross PayIN (before charges)
          payinCharges: walletResponse.data.payin_charges || 0,  // Total charges
          totalPayout: walletResponse.data.total_settlements || 0,
          settled_balance: walletResponse.data.settled_balance || 0,  // NEW: Settled amount
          unsettled_balance: walletResponse.data.unsettled_balance || 0  // NEW: Unsettled amount
        })
      }
      
      if (payinStatsResponse.success) {
        setPayinStats(payinStatsResponse.stats || {
          success: { count: 0, amount: 0 },
          pending: { count: 0, amount: 0 },
          failed: { count: 0, amount: 0 }
        })
        
        // Update time range data with payin data
        if (payinStatsResponse.timeRanges) {
          setTimeRangeData(prev => ({
            today: { ...prev.today, payin: payinStatsResponse.timeRanges.today.payin },
            yesterday: { ...prev.yesterday, payin: payinStatsResponse.timeRanges.yesterday.payin },
            last7days: { ...prev.last7days, payin: payinStatsResponse.timeRanges.last7days.payin },
            last30days: { ...prev.last30days, payin: payinStatsResponse.timeRanges.last30days.payin },
          }))
        }
      }
      
      if (payoutStatsResponse.success) {
        setPayoutStats(payoutStatsResponse.stats || {
          success: { count: 0, amount: 0 },
          pending: { count: 0, amount: 0 },
          failed: { count: 0, amount: 0 },
          queued: { count: 0, amount: 0 }
        })
        
        // Update time range data with payout data
        if (payoutStatsResponse.timeRanges) {
          setTimeRangeData(prev => ({
            today: { ...prev.today, payout: payoutStatsResponse.timeRanges.today.payout },
            yesterday: { ...prev.yesterday, payout: payoutStatsResponse.timeRanges.yesterday.payout },
            last7days: { ...prev.last7days, payout: payoutStatsResponse.timeRanges.last7days.payout },
            last30days: { ...prev.last30days, payout: payoutStatsResponse.timeRanges.last30days.payout },
          }))
        }
      }
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Dashboard data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    settled: walletData.balance,
    unsettled: payinStats.pending.amount,
    total: walletData.balance + payinStats.pending.amount,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your payment overview</p>
        </div>
        <Button onClick={loadDashboardData} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Box: Net PayIN with deductions */}
        <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Net PayIN</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(walletData.netPayin)}</div>
            <p className="text-xs text-gray-500 mt-2">
              Gross: {formatCurrency(walletData.grossPayin)} - Charges: {formatCurrency(walletData.payinCharges)}
            </p>
          </CardContent>
        </Card>

        {/* Second Box: Total PayIN (Gross) */}
        <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total PayIN</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(walletData.grossPayin)}</div>
            <p className="text-xs text-gray-500 mt-2">
              Gross amount before charges
            </p>
          </CardContent>
        </Card>

        {/* Third Box: Total Payout */}
        <Card className="hover:shadow-lg transition-shadow border-2 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Payout</CardTitle>
            <ArrowDownCircle className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{formatCurrency(walletData.totalPayout)}</div>
            <p className="text-xs text-gray-500 mt-2">
              Total settled to bank
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Balance Cards - Settled and Unsettled */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-green-600" />
              Settled Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">
              {formatCurrency(walletData.settled_balance)}
            </p>
            <p className="text-xs text-gray-500 mt-2">Available for payout - approved by admin</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              Unsettled Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-700">
              {formatCurrency(walletData.unsettled_balance)}
            </p>
            <p className="text-xs text-gray-500 mt-2">Pending admin settlement approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Payin/Payout Tabs */}
      <Tabs defaultValue="payin" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="payin">Payin</TabsTrigger>
          <TabsTrigger value="payout">Payout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payin" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TimeRangeStats title="Today" data={timeRangeData.today} />
            <TimeRangeStats title="Yesterday" data={timeRangeData.yesterday} />
            <TimeRangeStats title="Last 7 Days" data={timeRangeData.last7days} />
            <TimeRangeStats title="Last 30 Days" data={timeRangeData.last30days} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payin Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Success</p>
                      <p className="text-2xl font-bold text-green-600">{payinStats.success.count}</p>
                    </div>
                    <ArrowUpCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{formatCurrency(payinStats.success.amount)}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{payinStats.pending.count}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{formatCurrency(payinStats.pending.amount)}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Failed</p>
                      <p className="text-2xl font-bold text-red-600">{payinStats.failed.count}</p>
                    </div>
                    <ArrowDownCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{formatCurrency(payinStats.failed.amount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payout" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TimeRangeStats title="Today" data={timeRangeData.today} />
            <TimeRangeStats title="Yesterday" data={timeRangeData.yesterday} />
            <TimeRangeStats title="Last 7 Days" data={timeRangeData.last7days} />
            <TimeRangeStats title="Last 30 Days" data={timeRangeData.last30days} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payout Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Success</p>
                      <p className="text-2xl font-bold text-green-600">{payoutStats.success.count}</p>
                    </div>
                    <ArrowUpCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{formatCurrency(payoutStats.success.amount)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Queued</p>
                      <p className="text-2xl font-bold text-blue-600">{payoutStats.queued.count}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{formatCurrency(payoutStats.queued.amount)}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{payoutStats.pending.count}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{formatCurrency(payoutStats.pending.amount)}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Failed</p>
                      <p className="text-2xl font-bold text-red-600">{payoutStats.failed.count}</p>
                    </div>
                    <ArrowDownCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{formatCurrency(payoutStats.failed.amount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
