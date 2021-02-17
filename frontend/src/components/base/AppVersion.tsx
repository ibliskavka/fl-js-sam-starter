import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../contexts/AppContext";
export function AppVersion() {

  const [version, setVersion] = useState("");

  const context = useContext(AppContext);

  useEffect(() => {
    setVersion(context.config.version ? `v${context.config.version}` : "");
  }, [context.config])

  return (
    <div>
      {version} &nbsp;
    </div>
  );
}
