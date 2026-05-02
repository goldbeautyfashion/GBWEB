import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { categorySales } from '@/data/admin-data';

export default function AdminAnalytics() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Detailed performance metrics for your store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Visitors", value: "45.2K", trend: "+12.5%" },
          { label: "Conversion Rate", value: "3.2%", trend: "+0.4%" },
          { label: "Avg Order Value", value: "LKR 8,450", trend: "+5.2%" },
          { label: "Bounce Rate", value: "42.3%", trend: "-2.1%" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
              <p className={`text-xs mt-2 font-medium ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-green-500'}`}>
                {stat.trend} <span className="text-muted-foreground font-normal">vs last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm text-left mt-2">
              <thead className="text-xs text-muted-foreground uppercase bg-gray-50/50">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-md">Source</th>
                  <th className="px-4 py-3 font-medium text-right">Visitors</th>
                  <th className="px-4 py-3 font-medium text-right">Conversion</th>
                  <th className="px-4 py-3 font-medium rounded-tr-md text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { src: 'Direct', val: '15,230', conv: '4.2%', rev: 'LKR 450,200' },
                  { src: 'Instagram', val: '12,450', conv: '3.8%', rev: 'LKR 380,500' },
                  { src: 'Google Organic', val: '10,120', conv: '2.5%', rev: 'LKR 210,000' },
                  { src: 'Facebook Ads', val: '5,400', conv: '2.1%', rev: 'LKR 115,000' },
                  { src: 'Referral', val: '2,000', conv: '5.5%', rev: 'LKR 89,720' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 font-medium text-foreground">{row.src}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{row.val}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{row.conv}</td>
                    <td className="px-4 py-3 text-right font-medium text-primary">{row.rev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
