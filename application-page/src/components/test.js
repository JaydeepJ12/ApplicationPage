import {
    Card,
    Container
} from "@material-ui/core";
import React from "react";
import ExternalLookup from "./external_lookup.js";

export default function Test() {
  const handleExternalLookupChange = (id) => {
    console.log(id);
  };

  return (
    <form>
      <Card>
        <Container maxWidth="sm">
          <ExternalLookup
            typeId={1121}
            fieldName="Hotel"
            fieldId={1950}
            handleExternalLookupChange={handleExternalLookupChange}
          />
          <br></br>
          <br></br>
          <ExternalLookup
            typeId={1360}
            fieldName="Owner"
            fieldId={7913}
            handleExternalLookupChange={handleExternalLookupChange}
          />
        </Container>
      </Card>
    </form>
  );
}
