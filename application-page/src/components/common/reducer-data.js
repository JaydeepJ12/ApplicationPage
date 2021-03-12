import { navigate } from "@reach/router";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionData, applicationElements } from "../../redux/action.js";

const id_from_url = () => {
  let path = window.location.pathname;
  let split = path.split("/");
  //id should always be second from last rgardless of prefix

  console.log(split[split.length - 2]);
  return Number(split[split.length - 2]);
};

export default function ReducerData() {
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);

  const navigateToErrorPage = (message) => {
    navigate(process.env.REACT_APP_ERROR_PAGE, {
      state: {
        errorMessage: message,
      },
    });
  };

  const entitiesByEntityId = async () => {
    let path = window.location.pathname;
    let entityId = 0;
    if (path) {
      //entityId = Number(path.split("SearchID=")[1]?.split("/")[0]);
      entityId = id_from_url();
    }
    if (!entityId) {
      entityId = 0;
    }
    var jsonData = {
      entityId: entityId,
    };

    var config = {
      method: "post",
      url: "/cases/getEntitiesByEntityId",
      data: jsonData,
    };

    await axios(config)
      .then(function (response) {
        dispatch(applicationElements(response.data));
        var entityData = response.data.filter((x) => x.SYSTEM_CODE === "ASSCT");
        if (entityData) {
          let entityIds = entityData
            .map(function (x) {
              return x.EXID;
            })
            .join(",");
          if (entityIds) {
            caseTypesByEntityIds(entityIds);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        navigateToErrorPage(error?.message);
      });
  };

  const caseTypesByEntityIds = async (entityIds) => {
    var jsonData = {
      entityIds: entityIds,
    };

    var config = {
      method: "post",
      url: "/cases/caseTypesByEntityId",
      data: jsonData,
    };
    await axios(config)
      .then(function (response) {
        dispatch(actionData(response.data, "CASE_TYPE"));
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
        navigateToErrorPage(error?.message);
      });
  };

  useEffect(() => {
    entitiesByEntityId();
  }, [reducerState.applicationData.appId]);

  return "";
}
