import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actionData } from "../../redux/action.js";


const id_from_url = () =>{
  let path = window.location.pathname;
  let split= path.split('/')
  //id should always be second from last rgardless of prefix
  
  console.log(split[split.length - 2])
  return Number(split[split.length - 2])
}



export default function ReducerData() {
  const dispatch = useDispatch();
  const entitiesByEntityId = async () => {
   
    let path = window.location.pathname;
    let entityId = 0;
    if (path) {
      //entityId = Number(path.split("SearchID=")[1]?.split("/")[0]);
      entityId = id_from_url()
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
      });
  };

  useEffect(() => {
    entitiesByEntityId();
  }, []);

  return "";
}
