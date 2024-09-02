import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import GoogleInput from "@/components/GoogleInput";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { sortRides } from "@/lib/utils";
import { useLocationStore } from "@/store";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { setDestinationLocation, setUserLocation } = useLocationStore();
  const [loading, setLoading] = useState(true);
  const { data: recentRides, loading: isrideLoading } = useFetch(
    `/(api)/ride/${user?.id}`,
  );
  const sortedRides = recentRides ? sortRides(recentRides) : [];

  useEffect(() => {
    const reqLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        setLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude!,
        longitude: location.coords.longitude!,
      });
      setUserLocation({
        latitude: location.coords.latitude!,
        longitude: location.coords.longitude!,
        address: `${address[0].name}, ${address[0].region}`,
      });
      setLoading(false);
    };
    reqLocation();
  }, [setUserLocation]);

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  const handleSignout = () => {
    signOut();
    router.push("/(auth)/sign-in");
  };
  if (loading) return null

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={sortedRides}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyboardShouldPersistTaps="handled"
        className="px-4"
        contentContainerStyle={{
          paddingBottom: 80,
          paddingTop: 20,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!isrideLoading ? (
              <>
                <Image
                  source={images.noResult as any}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaExtraBold">
                Welcome{" "}
                {user?.firstName ||
                  user?.emailAddresses[0].emailAddress.split("@")[0]}
                👋
              </Text>
              <TouchableOpacity
                onPress={handleSignout}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out as any} className="w-4 h-4" />
              </TouchableOpacity>
            </View>

            <GoogleInput
              icon={icons.search}
              containerStyle="bg-white shadow-xs shadow-neutral-300"
              handlePress={handleDestinationPress}
            />

            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Your current location
              </Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>

            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text>
          </>
        }
      />
    </SafeAreaView>
  );
}
