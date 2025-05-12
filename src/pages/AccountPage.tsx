import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MapPin, Phone, Mail, Building, Briefcase, Leaf } from 'lucide-react';
import api from '@/config/api';

interface UserProfile {
  id: number;
  user_id: number;
  profile_image: string | null;
  bio: string | null;
  phone: string | null;
  address: string | null;
  organization: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

interface Plot {
  id: number;
  user_id: number;
  name: string;
  location: string;
  size: string;
  created_at: string;
}

interface Crop {
  id: number;
  plot_id: number;
  name: string;
  type: string;
  planting_date: string;
  expected_harvest_date: string;
  status: string;
}

export default function AccountPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState({
    profile: true,
    plots: true,
    crops: true
  });

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profiles');
        if (response.data && typeof response.data === 'object') {
          // If it's a valid profile object, set it
          setProfile(response.data);
        } else {
          // If no valid profile is returned, set to null
          setProfile(null);
          console.error('Invalid profile data received');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }
    };

    // Fetch plots data
    const fetchPlots = async () => {
      try {
        const response = await api.get('/plots');
        // Make sure plots is always an array
        if (Array.isArray(response.data)) {
          setPlots(response.data);
        } else if (response.data && typeof response.data === 'object') {
          // If API returns an object with data property that's an array
          setPlots(Array.isArray(response.data.data) ? response.data.data : []);
        } else {
          // Fallback to empty array
          setPlots([]);
        }
      } catch (error) {
        console.error('Error fetching plots:', error);
        setPlots([]);
      } finally {
        setLoading(prev => ({ ...prev, plots: false }));
      }
    };

    // Fetch crops data
    const fetchCrops = async () => {
      try {
        const response = await api.get('/crops');
        // Make sure crops is always an array
        if (Array.isArray(response.data)) {
          setCrops(response.data);
        } else if (response.data && typeof response.data === 'object') {
          // If API returns an object with data property that's an array
          setCrops(Array.isArray(response.data.data) ? response.data.data : []);
        } else {
          // Fallback to empty array
          setCrops([]);
        }
      } catch (error) {
        console.error('Error fetching crops:', error);
        setCrops([]);
      } finally {
        setLoading(prev => ({ ...prev, crops: false }));
      }
    };

    fetchProfile();
    fetchPlots();
    fetchCrops();
  }, []);

  return (
    <div className="container px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Account Overview</h1>
      <p className="text-muted-foreground">
        View and manage your personal information, plots, and crop details.
      </p>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="plots">Plots</TabsTrigger>
          <TabsTrigger value="crops">Crops</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your account details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading.profile ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <Avatar className="h-20 w-20 border">
                      <AvatarImage src={profile?.profile_image || ''} alt={user?.fullName || 'Profile'} />
                      <AvatarFallback className="text-lg">{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-medium">{user?.fullName}</h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profile?.phone || 'Not provided'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profile?.address || 'Not provided'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Organization</h4>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{profile?.organization || 'Not provided'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{profile?.role || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  {profile?.bio && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground">Bio</h4>
                      <p className="text-sm">{profile.bio}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plots" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Plots</CardTitle>
              <CardDescription>
                Details of all your registered land plots.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading.plots ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : plots.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {plots.map((plot) => (
                    <Card key={plot.id} className="overflow-hidden">
                      <div className="bg-muted h-32 flex items-center justify-center">
                        <MapPin className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{plot.name}</h3>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{plot.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Size:</span>
                            <span>{plot.size}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Registered:</span>
                            <span>{new Date(plot.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">No plots registered yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crops" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Crops</CardTitle>
              <CardDescription>
                Details of all your crop plantations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading.crops ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : crops.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {crops.map((crop) => (
                    <Card key={crop.id} className="overflow-hidden">
                      <div className="bg-muted h-32 flex items-center justify-center">
                        <Leaf className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{crop.name}</h3>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span>{crop.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="capitalize">{crop.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Planted:</span>
                            <span>{new Date(crop.planting_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expected Harvest:</span>
                            <span>{new Date(crop.expected_harvest_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">No crops added yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
