import React, { useEffect} from "react";
import MainApp from "./MainApp";
import Setup from "./Setup";
import { useSelector, useDispatch } from "react-redux";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { initDomain } from "../Redux/setup/setupSlice";


export default function Entry() {
  const dispatch = useDispatch();
  const domain = useSelector((state) => state.setup);
  const { getItem } = useAsyncStorage("setup");

  useEffect(() => {
    getItem().then((setup) => {
      if (setup) dispatch(initDomain(JSON.parse(setup)));
    });
  }, []);

  return <>{domain?.domain ? <MainApp /> : <Setup />}</>;
}
