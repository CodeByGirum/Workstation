"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

function ProfileTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Make changes to your public profile here. Click save when you're done.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="Alex Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="alex.doe@example.com" disabled />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  )
}

function AppearanceTab() {
  const { setTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize the look and feel of the application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Theme</Label>
          <p className="text-sm text-muted-foreground">Select the theme for the dashboard.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTheme("light")}>
            Light
          </Button>
          <Button variant="outline" onClick={() => setTheme("dark")}>
            Dark
          </Button>
          <Button variant="outline" onClick={() => setTheme("system")}>
            System
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function NotificationsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <Label>Communication emails</Label>
            <p className="text-sm text-muted-foreground">Receive emails about new features and updates.</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <Label>Marketing emails</Label>
            <p className="text-sm text-muted-foreground">Receive emails about promotions and special offers.</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <Label>Query alerts</Label>
            <p className="text-sm text-muted-foreground">Get notified when a long-running query completes.</p>
          </div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>
  )
}

function AccountTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account settings and data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline">Export Account Data</Button>
      </CardContent>
      <CardFooter className="border-t border-destructive/20 bg-destructive/5 p-6">
        <div className="flex flex-col items-start gap-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-destructive">Delete Account</h4>
            <p className="text-sm text-destructive/80">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <Button variant="destructive">Delete My Account</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export function SettingsPage() {
  return (
    <DialogContent className="sm:max-w-[650px] p-0">
      <DialogHeader className="p-6 pb-0">
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>Manage your account settings and set e-mail preferences.</DialogDescription>
      </DialogHeader>
      <div className="p-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-4">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="appearance" className="mt-4">
            <AppearanceTab />
          </TabsContent>
          <TabsContent value="notifications" className="mt-4">
            <NotificationsTab />
          </TabsContent>
          <TabsContent value="account" className="mt-4">
            <AccountTab />
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  )
}
