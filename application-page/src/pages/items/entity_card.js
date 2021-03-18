import { Avatar, Box, Card, CardHeader } from "@material-ui/core";
import React from "react";
import { default as useStyles } from "../../assets/css/common_styles";
import ComponentLoader from "../../components/common/component-loader";
function EntityCard(props) {
  var classes = useStyles();


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
                    props.handleEntityInfo(entity.ENTITY_ID, entity.Title);
                  }}
                >
                  <CardHeader subheader={entity.Title} />
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
              {(props.componentLoader
                ? Array.from(new Array(4))
                : Array(2)
              ).map((item, index) => (
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
              ))}
            </>
          ) : (
            <div>No Records Found </div>
          )}
        </>
      )}
    </div>
  );
}
export default EntityCard;
