import { Avatar, Box ,Card, CardHeader } from "@material-ui/core";
import React from "react";
import { default as useStyles } from "../../assets/css/common_styles";
import ComponentLoader from "../../components/common/component-loader";
function EntityCard(props) {
  var classes = useStyles();

  const addDefaultSrc = (event) => {
    let userDefaultImage = require("../../assets/images/default-userimage.png");
    if (userDefaultImage) {
      event.target.src = userDefaultImage;
    }
  };
  
  const renderUserImage = (fullName) => {
    if (fullName) {
      return (
        <Avatar
          className={classes.large}
          onError={(event) => addDefaultSrc(event)}
          src={process.env.REACT_APP_USER_ICON.concat(fullName)}
          className={classes.avt_large}
        />
      );
    } else {
      return (
        <Avatar
          src="../../assets/images/default-userimage.png"
          className={classes.avt_large}
        />
      );
    }
  };

  return (
    <div className="page" id="entity-card">
      {props.entityList.length ? (
        <>
          {(props.componentLoader
            ? Array.from(new Array(props.entityList.length))
            : props.entityList
          ).map((entity, index) => (
            <Box key={index} width="100%">
              {entity ? (
                <Card
                  padding={0.5}
                  style={{ cursor: "pointer" }}
                  className={
                    props.entityList.length > 1
                      ? "card-user-case " + classes.mb_one
                      : "card-user-case"
                  }
                  
                  onClick={() => {
                    if(entity.EMPLOYEE_ID !== props.entityInfo.EMPLOYEE_ID){
                      props.handleEntityInfo(entity.EMPLOYEE_ID);
                    }
                   
                  }}
                >
                  <CardHeader
                    subheader={entity.DEPARTMENT_NAME}
                  />
                </Card>
              ) : (
                <>
                  {props.noDataFound ? (
                    <div>No Peoples Found </div>
                  ) : (
                    <ComponentLoader type="rect" />
                  )}
                </>
              )}
            </Box>
          ))}
        </>
      ) : (
        <>
          {props.componentLoader ? (
            <>
              {(props.componentLoader ? Array.from(new Array(4)) : Array(2)).map(
                (item, index) => (
                  <Box key={index} width="100%" padding={0.5}>
                    {item ? (
                      <img
                        style={{ width: "100%", height: 100 }}
                        alt={item.title}
                        src={item.src}
                      />
                    ) : (
                      <ComponentLoader type="rect" />
                    )}
                  </Box>
                )
              )}
            </>
          ) : (
            <div>No Peoples Found </div>
          )}
        </>
      )}
    </div>
  );
}
export default EntityCard;
