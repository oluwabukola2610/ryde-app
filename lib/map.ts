import { Driver, MarkerData } from "@/types/type";


export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}) => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (userLatitude == null || userLongitude == null) {
    console.error(
      "User latitude or longitude is missing. Using default location.",
    );
    return {
      latitude: 6.5536,
      longitude: 3.3391,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (destinationLatitude == null || destinationLongitude == null) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3;
  const longitudeDelta = (maxLng - minLng) * 1.3;

  return {
    latitude: userLatitude,
    longitude: userLongitude,
    latitudeDelta,
    longitudeDelta,
  };
};
export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude
  ) {
    console.error("Missing coordinates. Cannot calculate times.");
    return;
  }

  try {
    const timesPromises = markers.map(async (marker) => {
      try {
        const responseToUser = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY}`
        );
        const dataToUser = await responseToUser.json();

        console.log("Response to user:", dataToUser);

        if (
          !dataToUser.routes ||
          dataToUser.routes.length === 0 ||
          !dataToUser.routes[0].legs ||
          dataToUser.routes[0].legs.length === 0
        ) {
          console.error(
            "Invalid response from directions API to user:",
            dataToUser
          );
          return { ...marker, time: null, price: null };
        }

        const timeToUser = dataToUser.routes[0].legs[0].duration.value;

        const responseToDestination = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY}`
        );
        const dataToDestination = await responseToDestination.json();

        console.log("Response to destination:", dataToDestination);

        if (
          !dataToDestination.routes ||
          dataToDestination.routes.length === 0 ||
          !dataToDestination.routes[0].legs ||
          dataToDestination.routes[0].legs.length === 0
        ) {
          console.error(
            "Invalid response from directions API to destination:",
            dataToDestination
          );
          return { ...marker, time: null, price: null };
        }

        const timeToDestination =
          dataToDestination.routes[0].legs[0].duration.value;

        const totalTime = (timeToUser + timeToDestination) / 60;
        const price = (totalTime * 0.5).toFixed(2);

        return { ...marker, time: totalTime, price };
      } catch (error) {
        console.error("Error fetching directions:", error);
        return { ...marker, time: null, price: null };
      }
    });

    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times:", error);
  }
};

