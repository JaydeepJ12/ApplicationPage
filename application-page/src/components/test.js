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
            applicationId = {1}
            typeId={1121}
            fieldName="Hotel"
            fieldId={1950}
            handleExternalLookupChange={handleExternalLookupChange}
          />
          <br></br>
          <br></br>
          <ExternalLookup
            applicationId = {1}
            typeId={1360}
            fieldName="Owner"
            fieldId={7913}
            handleExternalLookupChange={handleExternalLookupChange}
          />
           <br></br>
          <br></br>
          <ExternalLookup
            applicationId = {0}
            typeId={213}
            fieldName="Vendor"
            fieldId={3405}
            handleExternalLookupChange={handleExternalLookupChange}
          />
        </Container>
      </Card>
    </form>
  );
}
