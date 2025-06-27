// src/components/UmlRenderer.jsx
import React, { useState, useMemo } from "react";
import { encode as plantumlEncode } from "plantuml-encoder";

/**
 * Removes any leading “plantuml” marker and ensures the code
 * is wrapped with @startuml / @enduml.
 */
function cleanPlantUmlCode(raw) {
  if (!raw) return "";
  let code = raw.trim();
  // strip an initial “plantuml” keyword if present
  code = code.replace(/^plantuml[\r\n]+/i, "");
  if (!code.startsWith("@startuml")) {
    code = `@startuml\n${code}`;
  }
  if (!code.endsWith("@enduml")) {
    code = `${code}\n@enduml`;
  }
  return code;
}

const UmlRenderer = ({ umlCode }) => {
  const [error, setError] = useState(null);

  // memoize the cleaned & encoded PlantUML
  const { cleaned, encoded } = useMemo(() => {
    try {
      const cleaned = cleanPlantUmlCode(umlCode);
      const encoded = plantumlEncode(cleaned);
      return { cleaned, encoded };
    } catch (e) {
      setError("Failed to process UML code");
      return { cleaned: "", encoded: "" };
    }
  }, [umlCode]);

  if (!umlCode) {
    return <div className="text-neutral-400">No UML diagram available.</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const src = `https://www.plantuml.com/plantuml/svg/${encoded}`;

  return (
    <div className="uml-renderer">
      <img
        src={src}
        alt="UML Diagram"
        className="mt-4 border border-gray-600 rounded max-w-full"
        onError={() => setError("Failed to load UML diagram")}
      />
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-neutral-400">
          Show raw PlantUML code
        </summary>
        <pre className="mt-2 p-2 bg-gray-800 text-sm rounded overflow-auto">
          {cleaned}
        </pre>
      </details>
    </div>
  );
};

export default UmlRenderer;
