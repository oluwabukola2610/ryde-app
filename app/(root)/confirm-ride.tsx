import { router } from "expo-router";
import { FlatList, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useDriverStore } from "@/store";

const ConfirmRide = () => {
  const { selectedDriver, setSelectedDriver, drivers } = useDriverStore();

  return (
    <RideLayout title={"Choose a Rider"} snapPoint={["65%", "85%"]}>
      <FlatList
        data={drivers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <DriverCard
            item={item}
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(Number(item?.id))}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <CustomButton
              title="Select Ride"
              containerStyles="bg-primary-500"
              handlePress={() => router.push("/(root)/book-ride")}
              textStyles="text-white"
            />
          </View>
        )}
      />
    </RideLayout>
  );
};

export default ConfirmRide;
