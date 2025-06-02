import { useEffect, useRef, useState } from "react";
import { TreeNodeDatum } from "react-d3-tree";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ReactDOM from "react-dom";

const TreeViewNode = ({
  nodeDatum,
  toggleNode,
}: {
  nodeDatum: TreeNodeDatum;
  toggleNode: () => void;
}) => {
  const [isNodeHovered, setIsNodeHovered] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nodeRef = useRef<SVGCircleElement>(null);

  const docText = nodeDatum.attributes?.doc
    ? String(nodeDatum.attributes.doc).trim()
    : "This is a variable";

  const tooltipMaxWidth = 600;
  const tooltipMinWidth = 300;
  const tooltipHeight = Math.min(200, docText.split("\n").length * 20 + 40);

  useEffect(() => {
    if (isNodeHovered || isTooltipHovered) {
      // Clear any pending close timeout
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      if (nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        const svg = nodeRef.current.ownerSVGElement;
        if (svg) {
          const point = svg.createSVGPoint();
          point.x = rect.x + rect.width / 2;
          point.y = rect.y;
          const screenPoint = point.matrixTransform(svg.getScreenCTM()!);
          setNodePosition({
            x: screenPoint.x,
            y: screenPoint.y,
          });
        }
      }

      setShowTooltip(true);
    } else {
      closeTimeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 300);
    }

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [isNodeHovered, isTooltipHovered]);

  const renderTooltip = () => {
    if (!showTooltip) return null;

    return ReactDOM.createPortal(
      <div
        style={{
          position: "fixed",
          left: `${nodePosition.x - 180}px`,
          top: `${nodePosition.y - tooltipHeight - 50}px`,
          maxWidth: `${tooltipMaxWidth}px`,
          minWidth: `${tooltipMinWidth}px`,
          zIndex: 9999,
          pointerEvents: "auto",
        }}
        onMouseEnter={() => setIsTooltipHovered(true)}
        onMouseLeave={() => setIsTooltipHovered(false)}
      >
        <div
          style={{
            backgroundColor: "#2d2d2d",
            borderRadius: "5px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            border: "1px solid #444",
            overflow: "hidden",
            fontSize: "12px",
            color: "white",
          }}
        >
          <div
            style={{
              padding: "8px",
              borderBottom: "1px solid #444",
              fontWeight: "bold",
            }}
          >
            {nodeDatum.name}
            {nodeDatum.attributes?.type && (
              <span style={{ color: "#999", marginLeft: "8px" }}>
                ({nodeDatum.attributes.type})
              </span>
            )}
          </div>
          <SyntaxHighlighter
            language="python"
            style={a11yDark}
            customStyle={{
              margin: 0,
              padding: "8px",
              maxHeight: "150px",
              overflow: "auto",
            }}
          >
            {docText}
          </SyntaxHighlighter>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <g className="view__tree__group">
        <g className="view__tree__group__container">
          <circle
            className={
              showTooltip
                ? "view__tree__group__circle1 active"
                : "view__tree__group__circle1"
            }
            r="30"
            stroke="none"
          />

          <circle
            ref={nodeRef}
            className="view__tree__group__circle2"
            r="15"
            onClick={toggleNode}
            onMouseEnter={() => setIsNodeHovered(true)}
            onMouseLeave={() => setIsNodeHovered(false)}
            style={{ cursor: "pointer" }}
          />
        </g>

        <text
          className="view__tree__group__text"
          x="20"
          style={{ pointerEvents: "none" }}
        >
          {nodeDatum.name}
        </text>
        <text x="20" y="20" className="view__tree__group__return">
          {nodeDatum.attributes?.returnType
            ? "Return " + nodeDatum.attributes?.returnType
            : nodeDatum.attributes?.type}
        </text>
        <text x="20" y="40" className="view__tree__group__value">
          {nodeDatum.attributes?.value &&
          typeof nodeDatum.attributes?.value == "number"
            ? "Value " + Number((nodeDatum.attributes?.value).toFixed(4))
            : ""}
        </text>
      </g>

      {renderTooltip()}
    </>
  );
};

export default TreeViewNode;
