import Active from "@/components/booking_tabs/Active";
import Completed from "@/components/booking_tabs/Completed";
import React, {useState} from "react";
import {useWindowDimensions} from "react-native";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";

const renderScene = SceneMap({
  active: Active,
  completed: Completed,
});

const routes = [
  {key: "active", title: "Active"},
  {key: "completed", title: "Completed"},
];

const Booking = () => {
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{backgroundColor: "#0F2535", height: 3}}
          style={{backgroundColor: "white"}}
          pressColor="transparent"
          activeColor="#0F2535"
          inactiveColor="#999"
        />
      )}
    />
  );
};

export default Booking;
