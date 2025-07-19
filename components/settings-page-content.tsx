"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function ProfileTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This is how others will see you on the site.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/diverse-avatars.png" alt="User avatar" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <Button variant="outline">Change</Button>
            <Button variant="ghost" className="text-destructive hover:text-destructive">
              Remove
            </Button>
          </div>
        </div>
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

function SubscriptionTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Subscription</CardTitle>
          <CardDescription>You are currently on the Pro plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium">Pro Plan ($25.00 / month)</p>
              <p className="text-sm text-muted-foreground">Renews on December 23, 2024</p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Change your payment method.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded-md bg-muted flex items-center justify-center text-xs font-semibold border">
                VISA
              </div>
              <p>Visa ending in 1234</p>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cancel Subscription</CardTitle>
          <CardDescription>
            Canceling your subscription will downgrade you to the free plan at the end of your current billing cycle.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-start">
          <Button variant="destructive">Cancel Subscription</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export function SettingsPageContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
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
        <TabsContent value="subscription" className="mt-4">
          <SubscriptionTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
