import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function AdminSettings() {
  const handleSave = () => {
    toast.success("Settings saved successfully", {
      style: { backgroundColor: '#A77F1B', color: 'white', border: 'none' }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl space-y-6 pb-12"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your store configuration and preferences.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Store Information</CardTitle>
          <CardDescription>Basic details about your business.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input defaultValue="Gold Beauty Fashion" />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input defaultValue="hello@goldbeauty.lk" />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input defaultValue="LKR" disabled />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Input defaultValue="Asia/Colombo" disabled />
            </div>
          </div>
          <Button onClick={handleSave} className="bg-primary hover:bg-accent text-white mt-4">Save Information</Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Delivery Settings</CardTitle>
          <CardDescription>Configure shipping rules and thresholds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-sm">
            <Label>Free Delivery Threshold (LKR)</Label>
            <Input type="number" defaultValue="10000" />
            <p className="text-xs text-muted-foreground">Orders above this amount will get free shipping.</p>
          </div>
          <Button onClick={handleSave} variant="outline" className="mt-4">Update Delivery Rules</Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Notifications</CardTitle>
          <CardDescription>Choose how you want to be alerted.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">New Order Email</Label>
              <p className="text-sm text-muted-foreground">Receive an email when a new order is placed.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Low Stock Alert</Label>
              <p className="text-sm text-muted-foreground">Get notified when a product has less than 5 items left.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Daily Summary</Label>
              <p className="text-sm text-muted-foreground">Receive a daily sales summary at 8:00 PM.</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-destructive/20 shadow-sm bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Clear Store Data</p>
              <p className="text-sm text-muted-foreground">This will wipe all local storage data, resetting the editor and cart.</p>
            </div>
            <Button variant="destructive">Clear All Data</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
