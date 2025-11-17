import Pooling from "@/components/request_tabs/Pooling";
import Regular from "@/components/request_tabs/Regular";
import React, {useState} from "react";
import {useWindowDimensions} from "react-native";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";

const renderScene = SceneMap({
  regular: Regular,
  pooling: Pooling,
});

const routes = [
  {key: "regular", title: "Regular"},
  {key: "pooling", title: "Pooling"},
];

const Request = () => {
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

export default Request;
